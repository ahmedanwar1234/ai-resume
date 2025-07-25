import { prepareInstructions } from 'constants/index';
import { convertPdfToImage } from 'lib/pdfToImage';
import { usePuterStore } from 'lib/puter';
import { generateUUID } from 'lib/utils';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar';

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusTexts, setStatusTexts] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate=useNavigate()

  const handleFileSelect = (file: File | null): void => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setStatusTexts('Uploading the file...');
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) return setStatusTexts('Error: Failed to upload file');

      setStatusTexts('Converting to image...');
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) return setStatusTexts('Error: Failed to convert PDF to image');

      setStatusTexts('Uploading the image...');
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) return setStatusTexts('Error: Failed to upload image');

      setStatusTexts('Preparing data...');
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: '',
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      console.log(prepareInstructions({ jobTitle, jobDescription }));

      setStatusTexts('Analyzing...');
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );

      console.log(feedback)
      if (!feedback) return setStatusTexts('Error: Failed to analyze resume');

    const feedbackContent = feedback.message.content;
data.feedback = typeof feedbackContent === 'string' ? JSON.parse(feedbackContent) : feedbackContent[0];

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusTexts('Analysis complete, redirected');
navigate(`/resume/${uuid}`)
    } catch (error) {
      console.error(error);
      setStatusTexts('Unexpected error occurred');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) return;

    handleAnalyze({ jobDescription, companyName, jobTitle, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusTexts}</h2>
              <img src="/images/resume-scan.gif" className="w-full" alt="Processing animation" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
        </div>

        {!isProcessing && (
          <form
            id="upload-form"
            onSubmit={handleSubmit}
            className="flex mt-8 flex-col gap-4"
            action=""
          >
            <div className="form-div">
              <label htmlFor="company-name">Company Name</label>
              <input id="company-name" type="text" name="company-name" placeholder="Company Name" />
            </div>

            <div className="form-div">
              <label htmlFor="job-title">Job Title</label>
              <input id="job-title" type="text" name="job-title" placeholder="Job Title" />
            </div>

            <div className="form-div">
              <label htmlFor="job-description">Job Description</label>
              <textarea
                id="job-description"
                rows={5}
                name="job-description"
                placeholder="Job Description"
              />
            </div>

            <div className="form-div">
              <label htmlFor="job-uploader">Upload Resume</label>
              <FileUploader onFileSelect={handleFileSelect} />
            </div>

            <button className="primary-button" type="submit">
              Analyze Resume
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Upload;

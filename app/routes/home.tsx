import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Navbar from "~/components/Navbar";
import { resumes } from "constants/index";
import ResumeCard from "~/components/ResumeCard";
import { useEffect } from "react";
import { usePuterStore } from "lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
   const {auth}=usePuterStore();

    const navigate=useNavigate()
    
useEffect(()=>{
if(!auth.isAuthenticated)navigate('auth?next=/')
},[auth.isAuthenticated])



  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return <main className=" bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className=" main-section py-16 ">
      <div className="page-heading">
<h1>Track Your Applicatinos & Resume Rationgs</h1>
<h2 > Review your submissions and check AI-powerd feedback</h2>
      </div>

    {resumes.length>0 &&
    
    
<div className="resumes-section">

  {resumes.map((resume:Resume)=>(
    <ResumeCard key={resume.id} resume={resume}/>
  ))}
</div>
    }
    </section>
    
  </main>
}

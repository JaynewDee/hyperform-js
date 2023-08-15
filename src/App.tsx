import { useEffect, useState } from 'react'
import './App.css'
import { LocalStorageHandler, ResumeBuilder } from './components/Builder'


export interface ResumeConfig {
  fullName: string,
  subtitle: string,
}

function App() {
  const [userResumeConfig, setUserResumeConfig] = useState<ResumeConfig>({
    fullName: "Joshua Newell Diehl",
    subtitle: "Full-Stack Web Developer"
  });

  
  useEffect(() => {
    const config = LocalStorageHandler.getResumeConfig();
    
    if (config) setUserResumeConfig(config);
     
  }, [])

  return (
    <>
      <ResumeBuilder config={userResumeConfig} setConfig={setUserResumeConfig} />
    </>
  )
}

export default App

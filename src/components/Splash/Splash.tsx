import { useEffect, useState } from "react"
import styles from "./Splash.module.css"
import { isPWA } from "../../utils/isPwa"

export default function Splash({children}:{children:React.ReactNode}){

 const [showSplash,setShowSplash] = useState(true)

 useEffect(()=>{

  if(isPWA()){

   const timer = setTimeout(()=>{

    setShowSplash(false)

   },1800)

   return ()=>clearTimeout(timer)

  }else{

   setShowSplash(false)

  }

 },[])

 if(!showSplash){
  return <>{children}</>
 }

 return(

  <div className={styles.splash}>

   <div className={styles.graph}>
    <span></span>
    <span></span>
    <span></span>
   </div>

   <div className={styles.logoContainer}>
    <img
     src="/logo-SF-blue-512.png"
     alt="Smart Finance"
     className={styles.logo}
    />
   </div>

   <h1 className={styles.title}>
    SMART FINANCE
   </h1>

   <p className={styles.subtitle}>
    Controle inteligente das suas finanças
   </p>

   <div className={styles.loader}>
    <div></div>
    <div></div>
    <div></div>
   </div>

  </div>

 )

}
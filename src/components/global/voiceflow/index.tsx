'use client'
import { LoadVoiceFlowAgent } from "@/lib/voiceflow"
import { useEffect } from "react"

const VoiceFlowAgent = () => {
    useEffect(() => {
        LoadVoiceFlowAgent()
    },[])
    return <></>
}
export default VoiceFlowAgent
"use client"
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({ setIsSetupComplete}: {
  setIsSetupComplete: (value: boolean) => void}) => {
  const [isMicCamToogledOn, setIsMicCamToogledOn] = useState(false)

  const call = useCall();

  if(!call) {
    throw new Error ('usecall must be used within StreamCall component')
  }

  useEffect(() => {
      if(isMicCamToogledOn) {
        call?.camera.disable();
        call?.microphone.disable();
      } else{
        call?.camera.enable();
        call?.microphone.enable();
      }
  }, [isMicCamToogledOn, call?.camera, call?.microphone])
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview/>
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input
            type='checkbox'
            checked={isMicCamToogledOn}
            onChange={(e) => setIsMicCamToogledOn(e.target.checked)}  
          />
          Silahkan Menggunakan Kamera Dan Mic
        </label>
        <DeviceSettings/>
      </div>
      <Button className='rounded-md bg-green-600 px-4 py-2.5'
      onClick={()=>{
        call.join();
        setIsSetupComplete(true);
      }}>
        Gabung Meeting
      </Button>
    </div>
  )
}

export default MeetingSetup

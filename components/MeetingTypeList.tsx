"use client"
import Image from 'next/image'

import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | 'isRecordings' | undefined>()
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values, setvalues] = useState({
      dateTime: new Date(),
      description: '',
      link: '',
    })
    const [callDetails, setCallDetails] = useState<Call>()
    const { toast } = useToast()

    const createMeeting = async() => {
        if(!client || !user) return
        try {
          if(!values.dateTime){
            toast({title: "Please select a date and time"})
            return;
          }

          const id = crypto.randomUUID();
          const call = client.call('default',id)

          if(!call) throw new Error('Failed to create call')
          const startsAt = values.dateTime.toISOString() ||
          new Date(Date.now()).toISOString();
          const description = values.description || 'Intant meeting';
          await call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description
              }
            }
          })
          setCallDetails(call);
          if(!values.description){
            router.push(`/meeting/${call.id}`)
          }
          toast({title: "Meeting Created"})
        } catch (error) {
          console.log(error);
          toast({title: "Failed to create meeting"})
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
    return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
    <HomeCard
    img='/icons/add-meeting.svg'
    title= "Meeting Baru"
    description= "Mulai Meeting"
    handleClick={()=>setmeetingState('isInstantMeeting')}
    className="bg-lilac-1"
    />
    <HomeCard
    img='/icons/schedule.svg'
    title= "Jadwal Meeting"
    description= "Buat Jadwal Meeting"
    handleClick={()=>setmeetingState('isScheduleMeeting')}
    className="bg-green-1"

    />
    <HomeCard
    img='/icons/recordings.svg'
    title= "Recording Baru"
    description= "Lihat Recording"
    handleClick={()=>setmeetingState('isRecordings')}
    className="bg-red-1"

    />
    <HomeCard
    img='/icons/join-meeting.svg'
    title= "Gabung Meeting"
    description= "Silahkan Gabung Meeting"
    handleClick={()=>setmeetingState('isJoiningMeeting')}
    className="bg-aqua-1"

    />
      {!callDetails ? (
      <MeetingModal
      isOpen={meetingState === 'isScheduleMeeting'}
      onClose={()=>setmeetingState(undefined)}
      title="Silahkan Buat Meeting Baru"
      handleClick={createMeeting}
      >
        <div className='flex flex-col gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-aqua-1'>
            Masukan Deskripsi
          </label>
          <Textarea className='border-none bg-dark-3 focus-visibele:ring-0
          focus-visible-ring-offset-0'
          onChange={(e) =>{
            setvalues({...values, description: e.target.value})
          }}/>
        </div>
        <div className='flex w-full flex-co gap-2.5'>
        <label className='text-base text-normal leading-[22px] text-aqua-1'>
            Masukan Waktu Dan Tanggal
          </label>
          <ReactDatePicker
          selected={values.dateTime}
          onChange={(date) => setvalues({...values, dateTime: date!})}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='time'
          dateFormat='MMMM d, yyyy h:mm aa'
          className='w-full rounded bg-dark-2 p-2 focus:outline-none'
          />
        </div>
      </MeetingModal>
      ):(
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={()=>setmeetingState(undefined)}
        title="Buat Meeting Baru"
        className="text-center"
        handleClick={() =>{
          navigator.clipboard.writeText(meetingLink);
          toast({ title:'Copy Link'})
          
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText='Copy Link Meeting'
    />
      )}
       <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={()=>setmeetingState(undefined)}
        title="Meeting Baru"
        className="text-center"
        buttonText="Mulai Meeting"
        handleClick={createMeeting}
    />
       <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={()=>setmeetingState(undefined)}
        title="Paste Link Disni"
        className="text-center"
        buttonText="Ikut Meeting"
        handleClick={() => router.push(values.link)}
    >
      <Input
    placeholder='Link Meeting'
    className='border-none bg-dark-3
    focus-visible:ring-0
    focus-visible-ring-offset-0'
    onChange={(e) => setvalues({...values,link:e.target.value})}
    />
    </MeetingModal>
       <MeetingModal
        isOpen={meetingState === 'isRecordings'}
        onClose={()=>setmeetingState(undefined)}
        title="Paste Link Disni"
        className="text-center"
        buttonText="Lihat Recording"
        handleClick={() => router.push(values.link)}
    >
      <Input
    placeholder='Link Meeting'
    className='border-none bg-dark-3
    focus-visible:ring-0
    focus-visible-ring-offset-0'
    onChange={(e) => setvalues({...values,link:e.target.value})}
    />
    </MeetingModal>
    
    </section>
  )
}

export default MeetingTypeList

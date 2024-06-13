import StreamVideoProvider from '@/providers/StreamCilent'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Hadi Zoom",
  description: "Hadi Zoom",
  icons: {
    icon: '/icons/hadi.png'
  }
};

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <main>
      <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout

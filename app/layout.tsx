import './globals.css'
import { Lora } from 'next/font/google'

const lora = Lora({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lora.className} style={{ backgroundColor: "#FAF9F6" }}>
        {children}
      </body>
    </html>
  )
}



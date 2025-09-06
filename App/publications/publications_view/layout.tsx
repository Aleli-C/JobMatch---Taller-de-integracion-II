// app/publications/publications-view/layout.tsx
import "../../globals.css"
import Header from "../../../components/header"

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
}

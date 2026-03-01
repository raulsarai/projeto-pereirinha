import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Projeto Pereirinha',
  description: 'Painel administrativo do Projeto Pereirinha',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

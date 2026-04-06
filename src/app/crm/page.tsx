'use client'

import dynamic from 'next/dynamic'

const SubsidyCRM = dynamic(() => import('@/components/crm/SubsidyCRM'), { ssr: false })

export default function CRMPage() {
  return <SubsidyCRM />
}

'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import SubsidyCards from '@/components/SubsidyCards'
import ScheduleTimeline from '@/components/ScheduleTimeline'
import BenefitCalculator from '@/components/BenefitCalculator'
import TaxBenefits from '@/components/TaxBenefits'
import ProjectTracker from '@/components/ProjectTracker'
import ActionPlan from '@/components/ActionPlan'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard')
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting && e.target.id) setActiveSection(e.target.id) }),
      { rootMargin: '-40% 0px -40% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])
  return (
    <main style={{ minHeight: '100vh', background: 'var(--kuro)', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 20% 0%,rgba(30,45,94,.5) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,rgba(139,38,53,.15) 0%,transparent 50%)' }} />
      <Header activeSection={activeSection} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <section id="dashboard"><HeroBanner /></section>
        <section id="subsidies"><SubsidyCards /></section>
        <section id="schedule"><ScheduleTimeline /></section>
        <section id="calculator"><BenefitCalculator /></section>
        <section id="tax"><TaxBenefits /></section>
        <section id="tracker"><ProjectTracker /></section>
        <section id="action"><ActionPlan /></section>
      </div>
      <Footer />
    </main>
  )
}

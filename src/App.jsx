import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Rooms from './components/Rooms'
import Activities from './components/Activities'
import Food from './components/Food'
import Gallery from './components/Gallery'
import Reviews from './components/Reviews'
import Destinations from './components/Destinations'
import PlanTrip from './components/PlanTrip'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatButtons from './components/FloatButtons'

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Rooms />
        <Activities />
        <Food />
        <Gallery />
        <Reviews />
        <Destinations />
        <PlanTrip />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatButtons />
    </>
  )
}

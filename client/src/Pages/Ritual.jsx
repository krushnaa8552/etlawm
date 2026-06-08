const Ritual = () => {

  return (
    <div className="grid grid-cols-2 gap-10 items-start">
      {/* Left: normal scrolling content */}
      <div className="space-y-10">
        <section className="h-screen bg-gray-100">Section 1</section>
        <section className="h-screen bg-gray-200">Section 2</section>
        <section className="h-screen bg-gray-300">Section 3</section>
      </div>
    
      {/* Right: stays fixed while the parent is visible */}
      <div className="sticky top-20 h-fit">
        <section className="h-screen bg-gray-600">Section 1</section>
      </div>
    </div>
  )
}

export default Ritual;
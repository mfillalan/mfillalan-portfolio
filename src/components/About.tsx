import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const ref = useScrollReveal();
  return (
    <section id="about" className="section reveal" ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <p>
            I've been writing code since I was 11 — what started as obsessive curiosity
            became a 14-year professional career. I'm a hard worker who genuinely enjoys the
            craft: I don't stop at "it works," I keep going until it's something I'm proud of.
          </p>
          <p>
            My background is in building and modernizing production systems, but what drives
            me is finding the creative angle inside technical problems. I gravitate toward
            experiences that feel alive — I believe good software should have the same pull
            as a great game: intuitive, responsive, and just fun to use. I bring that same
            design sensibility to the products I build, crafting UIs that feel less like
            forms and more like worlds.
          </p>
          <p>
            I'm actively looking to work on projects that push boundaries — teams willing to
            think differently about what software can be. I've gone deep on AI-native
            development over the past year and I'm eager to apply that alongside strong
            full-stack fundamentals wherever creative, motivated people are building
            something worth building.
          </p>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GithubIcon, LinkedinIcon } from './icons'

const EMAIL = 'mfillalan@gmail.com'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <section id="contact" className="py-28 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 sm:p-14 text-center"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90%] h-48 bg-gradient-to-b from-primary/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Contact
            </p>
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight text-balance mb-4">
              Let&apos;s build something solid.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Open to new roles, collaboration, or a focused conversation about platform
              modernization, full-stack delivery, and practical AI tooling.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Button
                size="lg"
                onClick={copyEmail}
                className="rounded-full min-w-56 relative overflow-hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="size-4" /> Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="size-4" /> {EMAIL}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={`mailto:${EMAIL}`}>
                  <Mail className="size-4" /> Email me
                </a>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2">
              <Button asChild variant="ghost" size="icon" className="rounded-full">
                <a
                  href="https://github.com/mfillalan"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <GithubIcon className="size-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="rounded-full">
                <a
                  href="https://linkedin.com/in/michael-fillalan"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="size-5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

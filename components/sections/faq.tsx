"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

const faqs = [
  {
    question: "How do I receive the template?",
    answer:
      "After checkout, Wemplate emails your ZIP file or access link with setup notes. This MVP uses manual delivery so drops can launch fast.",
  },
  {
    question: "Can I resell a template to a client?",
    answer:
      "Yes. The intended use is resale, customization, and rapid niche validation. Do not redistribute the raw source as a competing template pack.",
  },
  {
    question: "Does Google Pay work?",
    answer:
      "Checkout is powered by Stripe. Google Pay appears when the buyer's device, browser, currency, and Stripe settings support it.",
  },
  {
    question: "What happens to the daily random website generator?",
    answer:
      "That system comes next. This MVP creates the storefront and data structure that will receive those ten daily templates.",
  },
];

export function FAQ() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="faq"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={stagger}
      className="container-px mx-auto max-w-5xl scroll-mt-28 py-16"
    >
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase text-cobalt">FAQ</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Straight answers before checkout.
        </h2>
      </motion.div>
      <div className="divide-y divide-line rounded-lg border border-line bg-white/[0.045]">
        {faqs.map((faq) => (
          <motion.details
            key={faq.question}
            variants={fadeUp}
            className="group p-5 open:bg-white/[0.055]"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold text-ink">
              {faq.question}
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-line text-base transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{faq.answer}</p>
          </motion.details>
        ))}
      </div>
    </motion.section>
  );
}

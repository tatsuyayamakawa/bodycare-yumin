'use client';

import { ContactForm } from '@/ui/contact-form';
import { Footer } from '@/ui/footer';
import { Header } from '@/ui/header';

function Contact() {
  return (
    <>
      <Header />
      <main>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

export default Contact;

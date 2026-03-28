import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const Copyright = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-accent mb-4">Legal</p>
          <h1 className="text-4xl font-display font-bold text-foreground">Copyright Notice</h1>
        </div>

        <div className="prose max-w-none font-body text-foreground/80 space-y-6">
          <p>© {new Date().getFullYear()} Yash Raj Verma (V.Yash.Raj). All rights reserved.</p>
          
          <h2 className="font-display text-xl font-bold text-foreground">Intellectual Property</h2>
          <p>All content on this website, including but not limited to text, poems, stories, photographs, graphics, logos, and design elements, is the intellectual property of Yash Raj Verma unless otherwise stated.</p>
          
          <h2 className="font-display text-xl font-bold text-foreground">Book Content</h2>
          <p>"Indulgent Echoes" and all poems and stories contained within are protected by copyright law. No part of this publication may be reproduced, distributed, or transmitted in any form without prior written permission from the author.</p>
          
          <h2 className="font-display text-xl font-bold text-foreground">Website Content</h2>
          <p>All original content published on this website, including blog posts, poems, stories, and other creative works posted in the Echoes section, is protected by copyright and may not be reproduced without permission.</p>
          
          <h2 className="font-display text-xl font-bold text-foreground">Fair Use</h2>
          <p>Brief quotations for purposes of review, criticism, or commentary are permitted with proper attribution to the author and source.</p>
          
          <h2 className="font-display text-xl font-bold text-foreground">Social Media Sharing</h2>
          <p>You are welcome to share links to content on this website via social media. When sharing excerpts, please credit V.Yash.Raj and link back to this website.</p>
          
          <h2 className="font-display text-xl font-bold text-foreground">Contact</h2>
          <p>For permissions, licensing inquiries, or copyright-related questions, please contact <a href="mailto:yashrajverma916@gmail.com" className="text-primary hover:underline">yashrajverma916@gmail.com</a>.</p>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
);

export default Copyright;

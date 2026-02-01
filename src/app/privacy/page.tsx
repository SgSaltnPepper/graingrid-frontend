import React from "react";

export const metadata = {
  title: "Privacy Policy",
  description: "GrainGrid Privacy Policy - How we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="pt-32 pb-24 px-6 lg:px-12 bg-white min-h-screen text-zinc-900">
      <div className="max-w-4xl mx-auto">
         {/* Header */}
         <div className="mb-12 border-b border-zinc-100 pb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Legal
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-6 mb-4">
              Privacy Policy
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Last Updated: [Insert Date]</p>
         </div>

         {/* Content */}
         <div className="prose prose-zinc prose-lg max-w-none">
            
            {/* Section 1 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">1. Introduction</h2>
                <p className="mb-4 text-zinc-600 leading-relaxed">
                    Welcome to <strong>Grain Grid Company</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We deeply value the trust you place in us when trading agricultural products. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website [Insert Website URL] or engage with our services.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                    We are committed to protecting your personal data and ensuring transparency in how we handle your information, adhering to global best practices and applicable data protection laws.
                </p>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">2. Information We Collect</h2>
                <p className="mb-4 text-zinc-600">We collect information to facilitate trade, process orders, and improve our services. This includes:</p>
                
                <div className="pl-4 border-l-2 border-zinc-200 ml-2 space-y-6">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-2">A. Personal Information</h3>
                        <p className="mb-2 text-zinc-600">You may voluntarily provide specific information when you request a quote, place an order, or contact us. This includes:</p>
                        <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                            <li><strong>Identity Data:</strong> Name, job title, and company name.</li>
                            <li><strong>Contact Data:</strong> Email address, phone number, billing address, and shipping address.</li>
                            <li><strong>Trade Data:</strong> Details regarding your product interests (e.g., specific grain specifications, volume requirements) and import/export documentation.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-2">B. Payment & Transaction Information</h3>
                        <p className="mb-2 text-zinc-600">If you conduct business with us, we process the data necessary to fulfill your order.</p>
                        <p className="italic text-sm text-zinc-500 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                            <strong>Note:</strong> We do not directly store your credit card or sensitive banking credentials on our servers. All financial transactions are processed through secure, PCI-compliant third-party payment gateways.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-2">C. Technical & Usage Data</h3>
                        <p className="mb-2 text-zinc-600">When you access our website, our servers automatically collect standard technical data, including:</p>
                        <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                            <li>IP address and browser type.</li>
                            <li>Device information (mobile vs. desktop).</li>
                            <li>Pages visited, time spent on the site, and referring URLs.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">3. How We Use Your Information</h2>
                <p className="mb-4 text-zinc-600">We use your data strictly for legitimate business purposes:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: "Order Fulfillment", desc: "To process transactions, manage shipping/logistics, and generate invoices/export documentation." },
                        { title: "Communication", desc: "To respond to inquiries, send quotes, and provide updates on your shipment status." },
                        { title: "Improvement", desc: "To analyze website traffic and optimize our product offerings (e.g., identifying high-demand grains)." },
                        { title: "Marketing (Optional)", desc: "With your explicit consent, we may send newsletters regarding market trends or new harvest availability. You may opt-out at any time." },
                        { title: "Legal Compliance", desc: "To comply with export regulations, tax laws, and government requests." }
                    ].map((item, i) => (
                        <li key={i} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                            <strong className="block text-xs font-black uppercase tracking-widest mb-1">{item.title}</strong>
                            <span className="text-sm text-zinc-600">{item.desc}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">4. Disclosure of Your Information</h2>
                <p className="mb-4 text-zinc-600">We do not sell, trade, or rent your personal information. We only share your data in the following strict circumstances:</p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                    <li><strong>Service Providers:</strong> We share necessary details with trusted third parties who assist in our operations, such as freight forwarders (to ship your goods), payment processors, and IT support services. These parties are contractually obligated to keep your data confidential.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation (e.g., customs authorities).</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, sale, or asset transfer, user information may be part of the transferred assets.</li>
                </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">5. International Data Transfers</h2>
                <p className="text-zinc-600 leading-relaxed">As an export-oriented business, Grain Grid Company deals with clients globally. Your information may be transferred to—and maintained on—computers located outside of your state, province, or country where data protection laws may differ. We take all reasonable steps to ensure your data is treated securely and in accordance with this policy during such transfers.</p>
            </section>

            {/* Section 6 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">6. Security of Your Data</h2>
                <p className="mb-4 text-zinc-600">We utilize robust administrative, technical, and physical security measures to protect your personal information. This includes:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4 text-zinc-600">
                    <li><strong>SSL Encryption:</strong> Securing data transmitted across our website.</li>
                    <li><strong>Access Controls:</strong> Limiting access to personal data to only those employees who need it to perform their jobs.</li>
                    <li><strong>Vendor Vetting:</strong> Ensuring our partners adhere to strict security standards.</li>
                </ul>
                <p className="text-sm text-zinc-500 bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                    <strong>Disclaimer:</strong> While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet is 100% secure.
                </p>
            </section>

            {/* Section 7 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="mb-4 text-zinc-600">We use cookies to enhance your browsing experience.</p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                    <li><strong>Functional Cookies:</strong> Essential for the website to function (e.g., remembering your language preference).</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site (e.g., Google Analytics).</li>
                    <li><strong>Control:</strong> You can choose to disable cookies through your browser settings, though this may affect the functionality of our website.</li>
                </ul>
            </section>

            {/* Section 8 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">8. Your Data Rights</h2>
                <p className="mb-4 text-zinc-600">Regardless of your location, we respect your rights regarding your personal data. You are entitled to:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4 text-zinc-600">
                    <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                    <li><strong>Correction:</strong> Request that we correct any incorrect or incomplete data.</li>
                    <li><strong>Deletion:</strong> Request the erasure of your personal data (&quot;Right to be Forgotten&quot;), subject to legal retention requirements (e.g., tax records).</li>
                    <li><strong>Objection:</strong> Object to the processing of your data for marketing purposes.</li>
                </ul>
                <p className="text-zinc-600">To exercise any of these rights, please contact us at the email provided below.</p>
            </section>

            {/* Section 9 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">9. Third-Party Links</h2>
                <p className="text-zinc-600 leading-relaxed">Our website may contain links to third-party websites (e.g., industry news, partner sites). We are not responsible for the privacy practices or content of those third-party sites. We encourage you to review their privacy policies regarding your data.</p>
            </section>

            {/* Section 10 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">10. Children&apos;s Privacy</h2>
                <p className="text-zinc-600 leading-relaxed">Our services are intended for business professionals. We do not knowingly collect personal information from children under the age of 13. If we discover that a child has provided us with personal information, we will delete it immediately.</p>
            </section>

            {/* Section 11 */}
            <section className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">11. Changes to This Policy</h2>
                <p className="text-zinc-600 leading-relaxed">We may update this Privacy Policy to reflect changes in our practices or legal obligations. The &quot;Last Updated&quot; date at the top of this page will indicate the latest revision. We encourage you to review this page periodically.</p>
            </section>

            {/* Section 12 */}
            <section className="mb-12 p-8 bg-zinc-900 rounded-2xl text-white">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">12. Contact Us</h2>
                <p className="mb-6 text-zinc-400">If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Company Name</span>
                        <span className="text-lg font-bold">Grain Grid Company</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email</span>
                        <span className="text-lg font-bold hover:text-orange-500 transition-colors">[Insert Email]</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Address</span>
                        <span className="text-lg font-medium text-zinc-300">[Insert Physical Company Address]</span>
                    </div>
                </div>
            </section>
         </div>
      </div>
    </main>
  );
}
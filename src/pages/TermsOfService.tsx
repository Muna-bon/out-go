import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

const TermsOfService = () => {
  return (
    <Layout>
      <section className="py-12 bg-muted/30">
        <div className="container-app max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-2xl p-8 space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using OwtGo, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">2. Use of Service</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree to use OwtGo only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Use the service in any way that violates applicable laws</li>
                    <li>Impersonate any person or entity</li>
                    <li>Post false, misleading, or fraudulent content</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use the service for commercial purposes without authorization</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">4. Activity Participation</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    OwtGo facilitates connections between users for wellness activities. We are not responsible for the conduct of activity organizers or participants. Users participate in activities at their own risk and should exercise appropriate caution.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">5. Content</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain ownership of content you post on OwtGo. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">6. Disclaimer</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    OwtGo is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not liable for any injuries, damages, or losses arising from your use of the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these Terms of Service, please contact us at legal@owtgo.app.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfService;

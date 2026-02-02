import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="py-12 bg-muted/30">
        <div className="container-app max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-2xl p-8 space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, participate in activities, communicate with other users, or contact us for support. This information may include your name, email address, phone number, location, profile photo, and activity preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Connect you with activities and other users</li>
                    <li>Send you notifications about activities and updates</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect, investigate, and prevent fraudulent activity</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell your personal information. We may share your information with activity organizers when you join an activity, with other participants as necessary for the activity, and with service providers who assist in operating our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is ever fully secure or error-free.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You may access, update, or delete your account information at any time through your profile settings. You may also opt out of promotional communications by following the unsubscribe instructions in those messages.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at privacy@outgo.app.
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

export default PrivacyPolicy;

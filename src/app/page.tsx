import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-black">NSMS</span>
            </div>
            <div className="flex gap-4">
              <Link href="/signin">
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50">Sign In</Button>
              </Link>
              <Link href="/signin">
                <Button className="bg-black hover:bg-gray-800">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                Modern School Management Made <span className="text-gray-600">Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your educational institution with our comprehensive school management system. 
                Manage students, teachers, classes, and more from one powerful platform.
              </p>
              <div className="flex gap-4">
                <Link href="/signin">
                  <Button size="lg" className="text-lg px-8 bg-black hover:bg-gray-800">Start Free Trial</Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-gray-300 hover:bg-gray-50">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-100 rounded-2xl p-8 shadow-2xl border border-gray-200">
                <Image 
                  src="/avatar.png" 
                  alt="Dashboard Preview" 
                  width={500} 
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to manage your school efficiently</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="/student.png"
              title="Student Management"
              description="Manage student records, admissions, attendance, and performance tracking all in one place."
            />
            <FeatureCard
              icon="/teacher.png"
              title="Teacher Portal"
              description="Empower teachers with tools to manage classes, assignments, and communicate with students."
            />
            <FeatureCard
              icon="/parent.png"
              title="Parent Access"
              description="Keep parents informed with real-time updates on their child's progress and school activities."
            />
            <FeatureCard
              icon="/attendance.png"
              title="Attendance Tracking"
              description="Automated attendance system with real-time reporting and analytics."
            />
            <FeatureCard
              icon="/finance.png"
              title="Financial Management"
              description="Handle fees, payments, and financial reporting with ease and transparency."
            />
            <FeatureCard
              icon="/calendar.png"
              title="Schedule Management"
              description="Organize classes, exams, and events with our intuitive calendar system."
            />
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Built for Every Role</h2>
            <p className="text-xl text-gray-600">Tailored experiences for each user type</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <RoleCard
              title="Admin"
              description="Complete control over all system features and user management"
              link="/admin"
              shade="900"
            />
            <RoleCard
              title="Teacher"
              description="Manage classes, grades, and communicate with students"
              link="/teacher"
              shade="700"
            />
            <RoleCard
              title="Student"
              description="Access courses, assignments, and track progress"
              link="/student"
              shade="500"
            />
            <RoleCard
              title="Parent"
              description="Monitor child's performance and stay connected"
              link="/parent"
              shade="300"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10k+" label="Students" />
            <StatCard number="500+" label="Teachers" />
            <StatCard number="100+" label="Schools" />
            <StatCard number="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your School Management?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of schools already using NSMS to streamline their operations
          </p>
          <Link href="/signin">
            <Button size="lg" className="text-lg px-12 bg-white text-black hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
                <span className="text-white font-bold text-lg">NSMS</span>
              </div>
              <p className="text-sm">Next School Management System - Simplifying education administration</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Next School Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-400 transition-all bg-white">
    <div className="w-12 h-12 mb-4 relative">
      <Image src={icon} alt={title} width={48} height={48} />
    </div>
    <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const RoleCard = ({ title, description, link, shade }: { title: string; description: string; link: string; shade: string }) => {
  const shadeClasses: Record<string, string> = {
    "900": "bg-gray-900 hover:bg-black text-white",
    "700": "bg-gray-700 hover:bg-gray-800 text-white",
    "500": "bg-gray-500 hover:bg-gray-600 text-white",
    "300": "bg-gray-300 hover:bg-gray-400 text-gray-900",
  };
  
  return (
    <Link href={link}>
      <div className={`p-6 rounded-xl ${shadeClasses[shade]} hover:scale-105 transition-all cursor-pointer border border-gray-200`}>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div>
    <div className="text-4xl font-bold text-black mb-2">{number}</div>
    <div className="text-gray-600 text-lg">{label}</div>
  </div>
);

export default Homepage
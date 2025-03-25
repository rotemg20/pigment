
import { ColorPalette } from '@/utils/colorRules';

interface WebsitePreviewProps {
  palette: ColorPalette;
}

export default function WebsitePreview({ palette }: WebsitePreviewProps) {
  const previewStyles = {
    '--bg-color': palette.background,
    '--secondary-bg': palette.secondaryBg,
    '--secondary': palette.secondary,
    '--primary': palette.primary,
    '--text': palette.text,
    '--accent': palette.accent,
  } as React.CSSProperties;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg" style={previewStyles}>
      <div className="bg-[var(--background)] text-[var(--text)] p-4">
        <nav className="flex justify-between items-center">
          <div className="text-lg font-bold">Logo</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[var(--accent)]">Home</a>
            <a href="#" className="hover:text-[var(--accent)]">About</a>
            <a href="#" className="hover:text-[var(--accent)]">Services</a>
          </div>
        </nav>
      </div>
      
      <main className="bg-[var(--background)]">
        <section className="text-center py-12">
          <h1 className="text-[var(--primary)] text-4xl font-bold mb-4">
            Welcome to Our Site
          </h1>
          <p className="text-[var(--text)] mb-6">
            Experience the journey of a lifetime with us
          </p>
          <button className="bg-[var(--accent)] text-white px-6 py-2 rounded-md hover:opacity-90">
            Get Started
          </button>
        </section>

        {/* Recreating the second section from scratch */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Customized Packages',
                  description: 'Create your unique travel experience with our tailored packages. We adjust to your preferences and ensure you enjoy every bit of your journey.',
                  buttonText: 'Learn More'
                },
                {
                  title: 'Guided Tours',
                  description: 'Explore scenic locations with our knowledgeable guides. Enjoy a deep dive into the local culture and uncover hidden treasures along the way.',
                  buttonText: 'Find Out More'
                },
                {
                  title: 'Hotel Booking',
                  description: 'Book your perfect stay easily with our user-friendly booking system. Choose from various comfortable accommodations tailored to your needs.',
                  buttonText: 'Explore More'
                },
              ].map((item) => (
                <div 
                  key={item.title} 
                  className="bg-[var(--secondaryBg)] p-6 rounded-lg shadow"
                >
                  <div className="text-[var(--accent)] mb-4">★</div>
                  <h3 className="text-[var(--primary)] font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text)] text-sm mb-4">
                    {item.description}
                  </p>
                  <button className="border border-[var(--accent)] text-[var(--accent)] px-4 py-1 rounded hover:bg-[var(--accent)] hover:text-white text-sm transition-colors">
                    {item.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--secondary)] text-center py-16">
          <div className="container mx-auto px-4">
            <p className="text-[var(--background)] text-sm mb-2">
              Explore More
            </p>
            <h2 className="text-[var(--background)] text-4xl font-bold mb-4">
              Your Adventure Awaits
            </h2>
            <p className="text-[var(--background)] max-w-2xl mx-auto mb-8">
              Discover unique travel packages tailored just for you. Our goal is to connect you with unforgettable experiences, whether it's a beach vacation, a mountain escape, or family adventures. Dive into our offerings and start planning your next journey today!
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-[var(--accent)] text-white px-6 py-2 rounded hover:opacity-90">
                Learn More
              </button>
              <button className="border border-[var(--background)] text-[var(--background)] px-6 py-2 rounded hover:bg-white/10">
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

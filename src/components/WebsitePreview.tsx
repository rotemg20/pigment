
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
      <div className="bg-[var(--secondary)] text-[var(--background)] p-4">
        <nav className="flex justify-between items-center">
          <div className="text-lg font-bold">Logo</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[var(--accent)]">Home</a>
            <a href="#" className="hover:text-[var(--accent)]">About</a>
            <a href="#" className="hover:text-[var(--accent)]">Services</a>
          </div>
        </nav>
      </div>
      
      <main className="bg-[var(--background)] p-6">
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--secondaryBg)] p-6 rounded-lg">
              <h3 className="text-[var(--primary)] font-semibold mb-2">
                Feature {i}
              </h3>
              <p className="text-[var(--text)] text-sm">
                This is a sample feature description that showcases how the colors
                work together in a real context.
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-emerald-400 text-white py-20 px-4 md:px-10 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">
            The Mighty Oak Store (M.O.S)
          </h1>
          <p className="mt-4 text-xl md:text-2xl">
            Wholesome baby apparel that embodies love and self-worth.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            At The Mighty Oak Store LLC, our mission is to provide wholesome,
            quality baby apparel that embodies love and self-worth. We are
            committed to making a meaningful difference in the lives of women
            and children through our dedication to serving others and our
            financial contributions to communities. We aim to be a beacon of
            hope, spreading love and compassion to those in need, one garment at
            a time.
          </p>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            We believe everyone is enough, exceptional, and extraordinary.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Love & Compassion</h3>
              <p className="text-gray-700">
                We believe in spreading love through everything we do—whether
                it’s through the garments we create or the communities we
                support.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Empowerment</h3>
              <p className="text-gray-700">
                We empower women and children by supporting them with quality
                apparel and contributing to causes that lift them up.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quality & Care</h3>
              <p className="text-gray-700">
                We are dedicated to providing baby apparel that is crafted with
                the highest standards of quality and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-white px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Image
                src="/team/founder.jpg"
                alt="Founder"
                width={300}
                height={300}
                className="rounded-full mx-auto"
              />
              <h3 className="text-xl font-bold mt-4 text-center">Founder</h3>
              <p className="text-center text-gray-600">CEO & Founder</p>
              <p className="mt-4 text-gray-700">
                The visionary behind The Mighty Oak Store, leading the mission
                to spread love and self-worth through quality apparel.
              </p>
            </div>

            
            <div className="bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Image
                src="/team/designer.jpg"
                alt="Lead Designer"
                width={300}
                height={300}
                className="rounded-full mx-auto"
              />
              <h3 className="text-xl font-bold mt-4 text-center">
                Lead Designer
              </h3>
              <p className="text-center text-gray-600">Design Team</p>
              <p className="mt-4 text-gray-700">
                Creating baby apparel with love, ensuring each piece reflects
                our mission of quality and compassion.
              </p>
            </div>

            
            <div className="bg-gray-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Image
                src="/team/community.jpg"
                alt="Community Manager"
                width={300}
                height={300}
                className="rounded-full mx-auto"
              />
              <h3 className="text-xl font-bold mt-4 text-center">
                Community Manager
              </h3>
              <p className="text-center text-gray-600">Community Outreach</p>
              <p className="mt-4 text-gray-700">
                Leading the charge in connecting with and giving back to the
                communities that matter most.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-20 bg-emerald-400 text-white px-4 md:px-10 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">
            Want your baby featured on the site?
          </h2>
          <p className="mt-4 text-lg">
            Fill out this form below and send it to our email <br />
            <a
              href="mailto:THEMOS@themightyoakstore.com"
              className="underline text-white font-semibold"
            >
              THEMOS@themightyoakstore.com
            </a>
          </p>
          <a
            href="/forms/MOSReleaseForm.docx"
            download="MOSReleaseForm.docx"
            className="inline-block mt-8 bg-white text-green-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Download Form
          </a>
        </div>
      </section>
    </div>
  );
}

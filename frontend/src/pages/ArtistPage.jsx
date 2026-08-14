import React from "react";

export default function ArtistPage() {
  return (
    <div className="bg-background text-on-surface">
      {/* TopNavBar */}
      <nav className="bg-[#fbf9f5]/70 dark:bg-[#1b1c1a]/70 backdrop-blur-xl docked full-width top-0 sticky z-50 no-border-tonal-shift-bg-surface-container">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-xl font-serif font-bold text-[#8f4e00] dark:text-[#f4c430]">
            Mystic Trails of Maharashtra
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              className="font-sans uppercase tracking-widest text-xs text-[#1b1c1a] dark:text-[#fbf9f5] opacity-70 hover:scale-105 transition-transform duration-300 hover:text-[#8f4e00]"
              href="#"
            >
              Home
            </a>
            <a
              className="font-sans uppercase tracking-widest text-xs text-[#1b1c1a] dark:text-[#fbf9f5] opacity-70 hover:scale-105 transition-transform duration-300 hover:text-[#8f4e00]"
              href="#"
            >
              Explore Map
            </a>
            <a
              className="font-sans uppercase tracking-widest text-xs text-[#1b1c1a] dark:text-[#fbf9f5] opacity-70 hover:scale-105 transition-transform duration-300 hover:text-[#8f4e00]"
              href="#"
            >
              Heritage Quiz
            </a>
            <a
              className="font-sans uppercase tracking-widest text-xs text-[#1b1c1a] dark:text-[#fbf9f5] opacity-70 hover:scale-105 transition-transform duration-300 hover:text-[#8f4e00]"
              href="#"
            >
              Bazaar
            </a>
            <a
              className="font-sans uppercase tracking-widest text-xs text-[#8f4e00] dark:text-[#f4c430] border-b-2 border-[#8f4e00] dark:border-[#f4c430] pb-1 hover:scale-105 transition-transform duration-300 hover:text-[#8f4e00]"
              href="#"
            >
              Artist Shows
            </a>
          </div>

          <div className="flex items-center gap-6">
          
            <button className="bg-primary text-on-primary px-6 py-2 rounded-md font-sans uppercase tracking-widest text-xs font-bold scale-102 transition-all hover:scale-105">
              Login
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <header className="relative mb-24 min-h-[400px] flex items-center overflow-hidden rounded-xl">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-60"
              alt="dramatic wide shot of a traditional marathi theater stage with warm amber lighting and ornate wooden carvings"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaSBZi-k1HH97yENaadzdTleII-OkDh7ClvsdN4GGKCi6YW-KDJzDzVWL8zX-Y_smBTLwebLX2wh0QFrH3H8WO4b9MiRigSCqRGWoE_HH9k683OG2FSeTRwL0EJjFlgY8sjJTOVjeFQeViSx_SuoRk9ii64fQBCBcRO2G6AhI5b4upFfKzfVmTKGd_NySr1R7-l-qgdMeHVOAjARXawhgSKRp566t8Zd_LCDuFgGjUPq7zb9yQdqNSsacdkA1OR8ybJSkExCfNF0Y"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-2xl pl-12">
            <span className="label-md font-sans uppercase tracking-widest text-primary font-bold mb-4 block">
              Kalakaar Hub
            </span>
            <h1 className="display-lg text-6xl font-serif text-on-surface leading-tight mb-6">
              Where Heritage Finds Its{" "}
              <span className="italic text-tertiary">Voice</span>
            </h1>
            <p className="text-lg text-on-surface-variant font-body mb-8 max-w-lg">
              Experience the soul-stirring rhythm of Lavani, the devotional
              depth of Bharud, and the timeless drama of Maharashtra&apos;s
              local theater.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary text-on-primary px-8 py-4 rounded-md font-bold transition-all hover:scale-105 flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Create Show
              </button>
              <button className="bg-transparent border border-outline/20 text-on-surface px-8 py-4 rounded-md font-bold transition-all hover:scale-105">
                Watch Trailer
              </button>
            </div>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <section className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="w-full md:w-1/2">
            <label className="label-md font-sans uppercase tracking-widest text-xs text-outline mb-2 block">
              Search Performances
            </label>
            <div className="relative group">
              <input
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-primary transition-all text-xl font-serif placeholder:text-outline-variant/60"
                placeholder="Search by artist, genre or city..."
                type="text"
              />
              <span className="absolute right-0 top-4 material-symbols-outlined text-outline-variant">
                search
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="px-6 py-2 rounded-full bg-secondary-container text-on-secondary-container font-sans text-xs uppercase tracking-widest font-bold cursor-pointer">
              Lavani
            </span>
            <span className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant font-sans text-xs uppercase tracking-widest font-bold cursor-pointer border border-outline-variant/10">
              Theater
            </span>
            <span className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant font-sans text-xs uppercase tracking-widest font-bold cursor-pointer border border-outline-variant/10">
              Bharud
            </span>
          </div>
        </section>

        {/* Events Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          {/* Featured Large Card */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-lowest transition-all">
            <div className="grid md:grid-cols-2 h-full">
              <div className="relative h-[400px] md:h-auto overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="vibrant traditional lavani dancer in a bright silk paithani saree performing on stage with dynamic motion"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaAvYGrl6zUf1Z4yG6Gibk0dQ8Ck8FKUzEb85LYkjR11XsA5YNRPUi16G7waqPRxpGUFyzqZQ54ullNkqOqYjjGou6-AUBEsoRSP6roSu4t_uZbG96RZN4e4fAsogvQrCTc1S46bowHzh8tMYB4dgF0ZIK8gmr4sNeSftqzLzDHWL84VrvOQBm0lAu4t46Xll12wBKuIPzsBhxCV9_U1dPM1avYr8AoMS8zssQwR3uANV-jw9drmB-LrxFkX3OkesF6afBNwy7muI"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-tertiary text-on-tertiary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Trending
                  </span>
                </div>
              </div>

              <div className="p-10 flex flex-col justify-center">
                <span className="label-md font-sans uppercase tracking-widest text-primary text-xs font-bold mb-2">
                  Performance Art
                </span>
                <h3 className="text-4xl font-serif mb-4 leading-tight">
                  The Midnight Lavani: Strings of Solapur
                </h3>
                <p className="text-on-surface-variant font-body mb-8">
                  A contemporary take on traditional folk, featuring Padma Shri
                  awardee artists in an immersive theater setting.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary">
                      calendar_month
                    </span>
                    <span className="text-sm font-medium">
                      October 24, 2024 • 7:00 PM
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary">
                      person
                    </span>
                    <span className="text-sm font-medium">
                      Anjali Deshmukh &amp; Ensemble
                    </span>
                  </div>
                </div>

                <button className="bg-primary text-on-primary w-full py-4 rounded-md font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Side Card 1 */}
          <div className="md:col-span-4 flex flex-col bg-surface-container-low rounded-xl overflow-hidden group">
            <div className="relative h-48">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="dramatic theater spot lighting on a dark stage with mist and shadows creating a mysterious atmosphere"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1BKKGVeo_8p6Gua1RMH0Gq3352cl8VEnMZ19j0z_5ZgxBQRdJgKz24QLVX3r0Kkyw91LH4sB3VPI-CsCoACEpwJ3_yrmrSKb47XCH-OfCgy1xIQY408i2zvljcccgoYvDTnSvr3CdGriRWguDtuvgaUU_qLlX8Aufx2Lcr6FpN8w30bMYl3u8whibunK8cok7gd-u9wKHsxGsQLrwml4UYIGgYObZRMNXY-NCO2qdR_wcmJKFbT1-YYX_t4wiK1p6azZCLBzqZvc"
              />
            </div>

            <div className="p-8">
              <span className="label-md font-sans uppercase tracking-widest text-secondary text-xs font-bold mb-2">
                Theater
              </span>
              <h3 className="text-2xl font-serif mb-4">
                Ghashiram Kotwal: Reimagined
              </h3>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 font-sans uppercase tracking-tighter">
                <span>Nov 02</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span>Bal Gandharva Rang Mandir</span>
              </div>

              <button className="w-full border border-primary text-primary py-3 rounded-md font-bold transition-all hover:bg-primary hover:text-on-primary">
                Book Now
              </button>
            </div>
          </div>

          {/* Row 2 Card 1 */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-tertiary-container">
                  music_note
                </span>
              </div>
              <span className="text-xs font-sans font-bold text-outline uppercase">
                Limited Seats
              </span>
            </div>

            <h3 className="text-xl font-serif mb-2">Spiritual Bharud Night</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              A night of storytelling and devotional music by Niranjan Bhakre.
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-primary font-bold">₹450</span>
              <button className="text-secondary font-bold font-sans text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Reserve{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Row 2 Card 2 */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container">
                  theater_comedy
                </span>
              </div>
              <span className="text-xs font-sans font-bold text-outline uppercase">
                Free Entry
              </span>
            </div>

            <h3 className="text-xl font-serif mb-2">
              Street Play: Digital Loom
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              An experimental play exploring the intersection of tradition and
              tech.
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-secondary font-bold">
                Artist: Digital Loom
              </span>
              <button className="text-secondary font-bold font-sans text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Register{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Row 2 Card 3 */}
          <div className="md:col-span-4 relative overflow-hidden rounded-xl bg-primary-container p-8 flex flex-col justify-end min-h-[250px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">
                celebration
              </span>
            </div>
            <h3 className="text-2xl font-serif text-on-primary-container mb-2">
              Become a Performer?
            </h3>
            <p className="text-on-primary-container/80 text-sm mb-6">
              Join the hub, list your events and reach thousands of culture
              seekers.
            </p>
            <button className="bg-primary text-on-primary py-3 rounded-md font-bold w-max px-8">
              Get Started
            </button>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="relative py-24 mb-24">
          <div className="absolute left-0 top-0 w-3/4 h-full bg-surface-container-high rounded-r-[100px] -z-10"></div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="pl-12">
              <h2 className="text-5xl font-serif mb-6">
                Never Miss a <span className="italic">Beat</span>.
              </h2>
              <p className="text-on-surface-variant mb-8">
                Subscribe to get weekly updates on the most exclusive cultural
                shows, artist workshops, and heritage festivals across
                Maharashtra.
              </p>

              <div className="flex gap-2">
                <input
                  className="flex-1 bg-surface border-b border-outline-variant/40 focus:ring-0 focus:border-primary px-4 py-3 rounded-t-md"
                  placeholder="Email Address"
                  type="email"
                />
                <button className="bg-secondary text-on-secondary px-8 py-3 rounded-md font-bold uppercase tracking-widest text-xs">
                  Join Hub
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-8 -right-8 w-full h-full border border-primary/20 rounded-xl"></div>
              <img
                className="relative z-10 w-full h-[400px] object-cover rounded-xl shadow-2xl"
                alt="close up of intricate hand embroidery on a maharashtrian paithani saree with vibrant metallic threads"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8ZoBXYDVmS8FvBiQr917LrEWVoXYtQwviieZuXlxltsPjW6PW-13Y4maeXh9DXGBrO9hNWupQC40UC7eGh0Epb7-QLERhuQw_toGbqOuYR7Rsn6dHZzKxuBWSNEoMOKu8dzXO9WbLR_QVr4dWoNX2Vm31w7URnOjqoZsQMFThJIbKA1DkEpbniJOjD3pvwWa15duBEk1Xe4pV_8lzL_V6KUvnVb_qS90av9E3jz_xPgPn7fQJmFOKYPZUVoOk9z722KHz3Qp15BM"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e4e2de] dark:bg-[#1b1c1a] full-width p-12 tonal-transition-from-surface-to-variant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-screen-2xl mx-auto">
          <div className="space-y-6">
            <div className="font-serif italic text-lg text-[#156872] dark:text-[#7e4b89]">
              Mystic Trails of Maharashtra
            </div>
            <p className="font-sans text-sm tracking-tight text-[#1b1c1a]/60 dark:text-[#fbf9f5]/60 max-w-xs">
              Connecting the digital age with the timeless traditions of our
              soil. Preserving heritage, one performance at a time.
            </p>

            <div className="flex gap-4">
              <span className="material-symbols-outlined text-[#156872] cursor-pointer">
                social_leaderboard
              </span>
              <span className="material-symbols-outlined text-[#156872] cursor-pointer">
                share
              </span>
              <span className="material-symbols-outlined text-[#156872] cursor-pointer">
                public
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-sans uppercase tracking-widest text-xs font-extrabold text-[#1b1c1a]">
              Explore Hub
            </h4>
            <a
              className="font-sans text-sm tracking-tight text-[#1b1c1a]/60 dark:text-[#fbf9f5]/60 hover:underline decoration-[#8f4e00] underline-offset-4 transition-opacity"
              href="#"
            >
              Culture Guide
            </a>
            <a
              className="font-sans text-sm tracking-tight text-[#1b1c1a]/60 dark:text-[#fbf9f5]/60 hover:underline decoration-[#8f4e00] underline-offset-4 transition-opacity"
              href="#"
            >
              Contact Us
            </a>
            <a
              className="font-sans text-sm tracking-tight text-[#1b1c1a]/60 dark:text-[#fbf9f5]/60 hover:underline decoration-[#8f4e00] underline-offset-4 transition-opacity"
              href="#"
            >
              Regional Stories
            </a>
            <a
              className="font-sans text-sm tracking-tight text-[#1b1c1a]/60 dark:text-[#fbf9f5]/60 hover:underline decoration-[#8f4e00] underline-offset-4 transition-opacity"
              href="#"
            >
              Terms of Heritage
            </a>
          </div>

          <div className="flex flex-col justify-between">
            <div className="bg-surface-container-highest/50 p-6 rounded-lg">
              <span className="label-md font-sans uppercase tracking-widest text-[10px] text-outline block mb-2">
                A Digital Loom Production
              </span>
              <p className="text-xs font-sans italic">
                Crafted with pride in Pune, Maharashtra.
              </p>
            </div>

            <div className="mt-8 text-xs font-sans tracking-tight text-[#1b1c1a]/60 dark:text-[#fbf9f5]/60">
              © 2024 Mystic Trails of Maharashtra. The Digital Loom.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
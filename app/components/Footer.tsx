export default function Footer() {
  return (
    <footer className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] md:w-auto">
      <div className="glass-footer px-6 md:px-8 py-3 md:py-4 rounded-full">
        <p className="text-white/80 text-xs md:text-sm text-center">
          Developed by Team{" "}
          <a
            href="https://expose.software"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#51bb0b] font-semibold hover:text-[#6dd81f] transition-colors duration-200"
          >
            EXPOSE
          </a>{" "}
          for{" "}
          <a
            href="https://hackxios2k25.devfolio.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#51bb0b] font-semibold hover:text-[#6dd81f] transition-colors duration-200"
          >
            Hackxios 2K25
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

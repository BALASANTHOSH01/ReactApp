export function Footer() {
    return (
      <footer className="bg-black text-white py-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StudyHub</h3>
              <p className="text-zinc-400">
                Empowering students to achieve their academic goals through smart learning solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Home</li>
                <li>Materials</li>
                <li>About</li>
                {/* <li>Contact</li> */}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Study Materials</li>
                <li>Practice Tests</li>
                <li>Study Groups</li>
                {/* <li>Blog</li> */}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Facebook</li>
                {/* <li>Instagram</li> */}
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400">
            <p>&copy; 2024 StudyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  
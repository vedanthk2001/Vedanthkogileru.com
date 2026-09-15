Product logos for the Projects section.

Drop transparent SVG (preferred) or PNG here, then set the matching `logo:`
path in app/components/Projects.tsx:

  karat-wealth.svg   ->  logo: '/logos/karat-wealth.svg'
  13karat.svg        ->  logo: '/logos/13karat.svg'
  karatclub.svg      ->  logo: '/logos/karatclub.svg'

They render desaturated so three different brand palettes sit inside the
slate/indigo system instead of fighting it, and go full colour on hover.
An empty `logo:` renders nothing; a 404 hides itself.

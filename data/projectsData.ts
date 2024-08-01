interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Genetic Algorithm on a Robotic Controller',
    description: `Robotic Controller built with Genetic Algorithm, THE GOAL here was to implement
     genetic algorithm for soliving a real world problem like navigating a robot through a maze
      `,
    imgSrc: '/static/images/time-machine.jpg',
    href: 'https://github.com/AhmedMannai10/Robotic-Controller-With-Genetic-algorithm',
  },
  {
    title: 'Android Chat Room App ',
    description: `Using Java Sockets for a server hosted locally + managing multiple users, 
ChosChat is a simple Android app that allows users to enage in chat room converstions, reling on MySQl as a db
`,
    imgSrc: '/static/images/GhosChat.png',
    href: 'https://github.com/AhmedMannai10/GhosChat-Android-App',
  },
]

export default projectsData

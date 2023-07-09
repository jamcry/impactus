export interface Category {
  id: CategoryId;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: CategoryId;
  sdgNftIds: string[];
}

enum CategoryId {
  Education = "education",
  Sustainability = "sustainability"
}

const CATEGORIES: Category[] = [
  {
    id: CategoryId.Education,
    title: "Education",
    description: "Education is the process of facilitating learning."
  },
  {
    id: CategoryId.Sustainability,
    title: "Sustainability",
    description:
      "Sustainability is the ability to exist constantly. In the 21st century, it refers generally to the capacity for the biosphere and human civilization to coexist."
  }
];

const PROJECTS: Project[] = [
  {
    title: "Open Learning Initiative",
    description:
      "The Open Learning Initiative is an online platform that provides free and accessible educational resources to people around the world. It offers a wide range of courses and learning materials in various subjects, allowing individuals to enhance their knowledge and skills regardless of their location or financial resources. The platform leverages technology to make education more inclusive and empower learners to pursue their educational goals at their own pace. Whether it's learning a new language, acquiring programming skills, or studying advanced mathematics, the Open Learning Initiative provides a diverse and comprehensive learning experience for all.",
    image: "https://source.unsplash.com/random/300x200/?sig=1",
    id: "project1",
    categoryId: CategoryId.Education,
    sdgNftIds: ["3"]
  },
  {
    title: "Sustainable Energy Solutions",
    description:
      "Sustainable Energy Solutions is a project aimed at promoting renewable energy sources and reducing carbon emissions. By installing solar panels and wind turbines in communities, the project harnesses clean and abundant sources of energy. This not only helps to minimize the reliance on fossil fuels but also reduces greenhouse gas emissions, leading to a more sustainable and environmentally friendly future. In addition to the installation of renewable energy systems, the project conducts awareness campaigns and educational programs to promote energy conservation and empower individuals and communities to adopt sustainable energy practices.",
    image: "https://source.unsplash.com/random/300x200/?sig=2",
    id: "project2",
    categoryId: CategoryId.Sustainability,
    sdgNftIds: ["5"]
  },
  {
    title: "Community Garden Initiative",
    description:
      "The Community Garden Initiative focuses on creating and maintaining community gardens in urban areas. These gardens serve as valuable green spaces where local residents can come together, grow their own fresh produce, and connect with nature. The initiative not only promotes food security by providing access to affordable and nutritious food but also encourages sustainable practices such as composting and organic gardening. In addition to fostering a sense of community and social interaction, community gardens contribute to improved mental and physical well-being, education about healthy eating, and the beautification of neighborhoods.",
    image: "https://source.unsplash.com/random/300x200/?sig=3",
    id: "project3",
    categoryId: CategoryId.Sustainability,
    sdgNftIds: ["8"]
  }
];

export {CATEGORIES, PROJECTS};

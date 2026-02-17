import { Icons } from "@/components/common/icons";

interface SocialInterface {
  name: string;
  username: string;
  icon: any;
  link: string;
}

export const SocialLinks: SocialInterface[] = [
  {
    name: "Github",
    username: "@sondkarkrushna",
    icon: Icons.gitHub,
    link: "https://github.com/sondkarkrushna",
  },
  {
    name: "LinkedIn",
    username: "Krushna Sondkar",
    icon: Icons.linkedin,
    link: "https://www.linkedin.com/in/krushna-sondkar-20b215222/",
  },
  {
    name: "Twitter",
    username: "@krushnasondkar",
    icon: Icons.twitter,
    link: "https://twitter.com/namanbarkiya",
  },
  {
    name: "Gmail",
    username: "sondkarkrushna",
    icon: Icons.gmail,
    link: "mailto:sondkarkrushna@gmail.com",
  },
];

import {
  Bell,
  BookOpen,
  Calendar,
  CheckSquare,
  Grid,
  Heart,
  Layout,
  List,
  PieChart,
  Sliders,
  MapPin,
  Users,
  Share,
  File,
} from "react-feather";

const getPagesSection = (userRole) => [
  {
    href: "/dashboard/default",
    icon: Sliders,
    title: "Dashboards",
  },
  {
    href: "/pages/projects",
    icon: Layout,
    title: "Projects",
  },
  {
    href: "/pages/report",
    icon: File,
    title: "Report",
  },
  userRole !== "Client" && {
    href: "/pages/team-members",
    icon: Users,
    title: "Team Members",
  },
].filter(Boolean);

const componentsSection = [
  {
    href: "/ui",
    icon: Grid,
    title: "UI Elements",
    children: [
      {
        href: "/ui/alerts",
        title: "Alerts",
      },
      {
        href: "/ui/buttons",
        title: "Buttons",
      },
      {
        href: "/ui/cards",
        title: "Cards",
      },
      {
        href: "/ui/carousel",
        title: "Carousel",
      },
      {
        href: "/ui/embed-video",
        title: "Embed Video",
      },
      {
        href: "/ui/general",
        title: "General",
      },
      {
        href: "/ui/grid",
        title: "Grid",
      },
      {
        href: "/ui/modals",
        title: "Modals",
      },
      {
        href: "/ui/offcanvas",
        title: "Offcanvas",
      },
      {
        href: "/ui/tabs",
        title: "Tabs",
      },
      {
        href: "/ui/typography",
        title: "Typography",
      },
    ],
  },
  {
    href: "/icons",
    icon: Heart,
    title: "Icons",
    badge: "1500+",
    children: [
      {
        href: "/icons/feather",
        title: "Feather",
      },
      {
        href: "/icons/font-awesome",
        title: "Font Awesome",
      },
    ],
  },
  {
    href: "/forms",
    icon: CheckSquare,
    title: "Forms",
    children: [
      {
        href: "/forms/layouts",
        title: "Layouts",
      },
      {
        href: "/forms/basic-inputs",
        title: "Basic Inputs",
      },
      {
        href: "/forms/input-groups",
        title: "Input Groups",
      },
      {
        href: "/forms/floating-labels",
        title: "Floating Labels",
      },
    ],
  },
  {
    href: "/tables",
    icon: List,
    title: "Tables",
  },
];

const pluginsSection = [
  {
    href: "/form-plugins",
    icon: CheckSquare,
    title: "Form Plugins",
    children: [
      {
        href: "/form-plugins/advanced-inputs",
        title: "Advanced Inputs",
      },
      {
        href: "/form-plugins/formik",
        title: "Formik",
        badge: "New",
      },
      {
        href: "/form-plugins/editors",
        title: "Editors",
      },
    ],
  },
  {
    href: "/advanced-tables",
    icon: List,
    title: "Advanced Tables",
    children: [
      {
        href: "/advanced-tables/pagination",
        title: "Pagination",
      },
      {
        href: "/advanced-tables/column-sorting",
        title: "Column Sorting",
      },
      {
        href: "/advanced-tables/column-filtering",
        title: "Column Filtering",
      },
      {
        href: "/advanced-tables/row-expanding",
        title: "Row Expanding",
      },
      {
        href: "/advanced-tables/row-selection",
        title: "Row Selection",
      },
    ],
  },
  {
    href: "/charts",
    icon: PieChart,
    title: "Charts",
    badge: "New",
    children: [
      {
        href: "/charts/chartjs",
        title: "Chart.js",
      },
      {
        href: "/charts/apexcharts",
        title: "ApexCharts",
        badge: "New",
      },
    ],
  },
  {
    href: "/notifications",
    icon: Bell,
    title: "Notifications",
  },
  {
    href: "/maps",
    icon: MapPin,
    title: "Maps",
    children: [
      {
        href: "/maps/google-maps",
        title: "Google Maps",
      },
      {
        href: "/maps/vector-maps",
        title: "Vector Maps",
      },
    ],
  },
  {
    href: "/calendar",
    icon: Calendar,
    title: "Calendar",
  },
  {
    href: "/404",
    icon: Share,
    title: "Multi Level",
    children: [
      {
        href: "/404",
        title: "Two Levels",
        children: [
          {
            href: "/404",
            title: "Item 1",
          },
          {
            href: "/404",
            title: "Item 2",
          },
        ],
      },
      {
        href: "/404",
        title: "Three Levels",
        children: [
          {
            href: "/404",
            title: "Item 1",
            children: [
              {
                href: "/404",
                title: "Item 1",
              },
              {
                href: "/404",
                title: "Item 2",
              },
            ],
          },
          {
            href: "/404",
            title: "Item 2",
          },
        ],
      },
    ],
  },
];

const getNavItems = (userRole) => [
  {
    title: "Pages",
    pages: getPagesSection(userRole),
  },
  // Uncomment if needed
  // {
  //   title: "Tools & Components",
  //   pages: componentsSection,
  // },
  // {
  //   title: "Plugins & Addons",
  //   pages: pluginsSection,
  // },
];

export default getNavItems;

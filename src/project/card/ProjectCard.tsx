import {
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Image,
  Text,
  background
} from "@chakra-ui/react";
import {useEtherProvider} from "../../connection/EtherProviderContext";
import SignTxnButton from "../../sign-button/SignTxnButton";
import {Project} from "../projectTypes";
import {useNavigate} from "react-router-dom";

export default function ProjectCard({project}: {project: Project}) {
  const {defaultAccount} = useEtherProvider();
  const navigate = useNavigate();

  return (
    <Card
      width={"100%"}
      variant={"elevated"}
      className="project-card"
      style={{
        transition: "0.2s ease-in-out"
      }}
      _hover={{
        cursor: "pointer",
        transform: "scale(1.05)"
      }}
      onClick={() => navigate(`/projects/${project.id}`)}>
      <CardBody>
        <Image
          src={project.image}
          alt={project.title}
          width={"100%"}
          height={"200px"}
          objectFit={"cover"}
          borderRadius="lg"
        />

        <Stack mt="6" spacing="3">
          <Heading size="md">{project.title}</Heading>
          <Text>
            {
              // get first 120 char and add ... at the end
              project.description.length > 120
                ? project.description.substring(0, 120) + "..."
                : project.description
            }
          </Text>
          <Text color="blue.600" fontSize="2xl">
            <Text as={"span"} color="var(--chakra-colors-chakra-body-text)">
              {"Goal: "}
            </Text>
            $450
          </Text>
        </Stack>
      </CardBody>

      <Divider />

      <CardFooter>
        <ButtonGroup spacing="2">
          <Button
            colorScheme={"green"}
            onClick={() => navigate(`/projects/${project.id}`)}>
            {"Donate"}
          </Button>

          <Button
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate(`/projects/${project.id}`)}>
            Details
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

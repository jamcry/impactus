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
  Text
} from "@chakra-ui/react";
import {useEtherProvider} from "../../connection/EtherProviderContext";
import SignTxnButton from "../../sign-button/SignTxnButton";
import {Project} from "../projectTypes";
import {useNavigate} from "react-router-dom";

export default function ProjectCard({project}: {project: Project}) {
  const {defaultAccount} = useEtherProvider();
  const navigate = useNavigate();

  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src={project.image}
          alt={project.title}
          width={"300px"}
          height={"200px"}
          borderRadius="lg"
        />

        <Stack mt="6" spacing="3">
          <Heading size="md">{project.title}</Heading>
          <Text>{project.description}</Text>
          <Text color="blue.600" fontSize="2xl">
            $450
          </Text>
        </Stack>
      </CardBody>

      <Divider />

      <CardFooter>
        <ButtonGroup spacing="2">
          <SignTxnButton to={defaultAccount!} value={"0"} />

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

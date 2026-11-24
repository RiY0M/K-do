import { useNavigate } from "react-router-dom";
import ArrowLeftSvg from "../../../assets/svgs/ArrowLeftSvg";
import NoStyleButtonRedirect from "./NoStyleButtonRedirect";
import { RedirectProps } from "../../../interfaces/RedirectProps";

export default function BackLink({
  reverseDirection,
}: Readonly<RedirectProps>) {

  const navigate = useNavigate()

  return (
    <NoStyleButtonRedirect
      onClick={() => navigate(-1)}
      label="Retour"
      svg={<ArrowLeftSvg />}
      reverseDirection={reverseDirection}
    />
  );
}

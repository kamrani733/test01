import { Heading } from "@/components/ui/Heading";

export default function ServiceIntroduction({ data }) {
  return (
    <div>
      <Heading level={2} className="mb-1">
        {data.title}
      </Heading>
      <p className="text-[#525252] text-justify leading-relaxed">{data.description}</p>
    </div>
  );
}

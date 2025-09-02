"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/core/hooks/use-dictionary";
import AddItemPage from "@/components/account/AddItemPage";
import { Slider } from "@/core/models/slider-model";
import { SliderColumns } from "@/components/account/columns/SliderColumns";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/core/hooks/use-data-table-data";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { deleteSlider, getSliders } from "@/core/lib/api/account/sliders";

export default function Page() {
  const { data, isLoading } = useDataTableData<Slider>({
    fetchFunction: getSliders,
    queryKey: "sliders",
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["AccessSliders"]}>
      <Heading level={1}>{dictionary.nav.sliders}</Heading>
      {hasPermission("CreateSliders") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.slider}
        />
      )}

      <MainDataTable
        data={data}
        columns={SliderColumns(dictionary)}
        action={deleteSlider}
        isLoading={isLoading}
        queryKey={["sliders"]}
      />
    </ProtectWithPermissionWrapper>
  );
}

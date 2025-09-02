// /src/constants/options.ts

// دیگه async نیست، فقط نوع رو مشخص می‌کنیم
import { Dictionary } from "@/core/lib/dict";

export const getOptions = (dictionary: Dictionary) => ({
  STATUS_OPTIONS_USER: [
    { value: "active", label: dictionary.ui.status.active },
    { value: "deactive", label: dictionary.ui.status.deactive },
  ],

  GENDER_OPTIONS: [
    { value: "male", label: dictionary.forms.male },
    { value: "female", label: dictionary.forms.female },
  ],

  LEVEL_OPTIONS: [
    { value: "gold", label: dictionary.ui.level.gold },
    { value: "silver", label: dictionary.ui.level.silver },
    { value: "bronze", label: dictionary.ui.level.bronze },
  ],

  STATUS_OPTIONS_PAGE: [
    { value: "draft", label: "پیش‌نویس" },
    { value: "publish", label: "منتشر شده" },
    { value: "pending", label: "در انتظار بررسی" },
    { value: "trash", label: "زباله‌دان" },
    { value: "reject", label: "رد شده" },
  ],
});

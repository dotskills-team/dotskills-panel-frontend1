import { Badge } from "@/components/ui/badge";
import { userName } from "@/features/attendance/utils/attendance.utils";
import type { IAttendance } from "@/types/attendance.types";

const fmtEditedAt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  });

/** "Missing check-out" and "Edited" badges, with the edit reason shown under the Edited badge. */
export function AttendanceFlags({ record }: { record: IAttendance }) {
  if (!record.isMissingCheckOut && !record.isEdited) return null;

  return (
    <div className="flex max-w-64 flex-col items-start gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {record.isMissingCheckOut && (
          <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
            Missing check-out
          </Badge>
        )}
        {record.isEdited && (
          <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
            Edited
          </Badge>
        )}
      </div>
      {record.isEdited && (
        <p className="text-xs leading-snug text-muted-foreground">
          {record.editReason ? (
            <span className="whitespace-normal wrap-break-word text-foreground/80">“{record.editReason}”</span>
          ) : null}
          <span className="block">
            {record.editedBy ? `by ${userName(record.editedBy)}` : ""}
            {record.editedAt ? ` · ${fmtEditedAt(record.editedAt)}` : ""}
          </span>
        </p>
      )}
    </div>
  );
}

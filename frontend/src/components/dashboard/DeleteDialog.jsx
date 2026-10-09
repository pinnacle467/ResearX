import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const DeleteDialog = ({ project, onCancel, onConfirm }) => (
  <AlertDialog open={!!project} onOpenChange={(o) => !o && onCancel()}>
    <AlertDialogContent className="paper-pop sm:max-w-md" data-testid="delete-dialog">
      <AlertDialogHeader>
        <AlertDialogTitle className="display text-[22px] leading-tight">Delete “{project?.title}”?</AlertDialogTitle>
        <AlertDialogDescription className="text-[14px] text-stone-700">This removes the project, its sources, findings, and analyst chat. This cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="btn-secondary mt-0" data-testid="delete-cancel-btn">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="btn border-[1.5px] border-[#141a26] bg-rose-700 text-white shadow-[3px_3px_0_0_#141a26] hover:bg-rose-800" data-testid="delete-confirm-btn">Delete project</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

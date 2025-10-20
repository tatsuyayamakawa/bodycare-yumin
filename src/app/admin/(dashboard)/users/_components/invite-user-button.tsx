"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteUserAction } from "@/lib/actions/admin-auth";

const inviteFormSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  role: z.enum(["editor", "admin"]),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export function InviteUserButton() {
  const [open, setOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "editor",
    },
  });

  const handleSubmit = async (values: InviteFormValues) => {
    setIsInviting(true);

    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("role", values.role);

      const result = await inviteUserAction(formData);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        form.reset();

        if (result.invitationUrl) {
          await navigator.clipboard.writeText(result.invitationUrl);
          toast.info("招待URLをクリップボードにコピーしました");
        }

        window.location.reload();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Invite error:", error);
      toast.error("招待の送信に失敗しました");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="h-4 w-4" />
          新規招待
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新規ユーザー招待</DialogTitle>
          <DialogDescription>新しい管理者を招待します</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      disabled={isInviting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>権限</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isInviting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="権限を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="editor">編集者</SelectItem>
                      <SelectItem value="admin">管理者</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isInviting}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isInviting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {isInviting ? "送信中..." : "招待を送信"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

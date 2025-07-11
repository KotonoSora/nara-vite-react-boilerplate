import { ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import SocialPreview from "~/features/landing-page/assets/social-preview.svg?url";

import { usePageContext } from "./context/page-context";

type FormState = {
  id?: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string;
};

export function ContentShowcasePage() {
  const { showcases, openDetail, closeDetail } = usePageContext();

  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    url: "",
    image: "",
    tags: "",
  });

  const [showScroll, setShowScroll] = useState(false);

  const openCreate = () => {
    setFormMode("create");
    setForm({ name: "", description: "", url: "", image: "", tags: "" });
    setShowModal(true);
  };

  const openEdit = (project: (typeof showcases)[number]) => {
    setFormMode("edit");
    setForm({
      id: project.id,
      name: project.name,
      description: project.description,
      url: project.url,
      image: project.image,
      tags: project.tags.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    // call delete API
  };

  const handleSubmit = () => {
    // call create or update API
    setShowModal(false);
  };

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="min-h-screen bg-background px-4 py-8"
      style={{ contentVisibility: "auto" }}
    >
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/">
              <ArrowUp className="w-4 h-4 rotate-270" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Showcases</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcases.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col pt-0"
            onClick={() => {
              openDetail(project.name);
            }}
          >
            <img
              src={project.image ?? SocialPreview}
              alt={project.name}
              className="rounded-t-xl w-full h-48 object-cover"
              loading="lazy"
            />
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{project.name}</span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 grow">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(project)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showScroll && (
        <Button
          variant="secondary"
          className="fixed bottom-4 right-4 rounded-full p-2"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Add Project" : "Edit Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>
                {formMode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

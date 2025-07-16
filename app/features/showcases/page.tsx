import { ArrowUp, ExternalLink, Pencil, Plus, Search, Trash2, Filter, SortAsc, SortDesc, Grid, LayoutGrid } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "created">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    showcases.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [showcases]);

  // Filter and sort showcases
  const filteredAndSortedShowcases = useMemo(() => {
    let filtered = showcases.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !selectedTag || project.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });

    return filtered.sort((a, b) => {
      let compareValue = 0;
      if (sortBy === "name") {
        compareValue = a.name.localeCompare(b.name);
      } else {
        // For created, we'll use id as a proxy since there's no created date
        compareValue = a.id - b.id;
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  }, [showcases, searchQuery, selectedTag, sortBy, sortOrder]);

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

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      // call delete API
      // In a real app, this would make an API call
      console.log("Deleting project:", id);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // call create or update API
      // In a real app, this would make an API call
      console.log("Submitting form:", form);
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
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
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/">
                <ArrowUp className="w-4 h-4 rotate-270" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Showcases</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Discover amazing projects built with NARA
              </p>
            </div>
          </div>
          <Button onClick={openCreate} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter by Tags */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedTag ? selectedTag : "All Tags"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedTag("")}>
                  All Tags
                </DropdownMenuItem>
                {allTags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("created")}>
                  Recently Added
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? "Descending" : "Ascending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "compact" : "grid")}
            >
              {viewMode === "grid" ? <LayoutGrid className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredAndSortedShowcases.length} of {showcases.length} projects
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedTag && ` tagged with "${selectedTag}"`}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAndSortedShowcases.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery || selectedTag ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            {searchQuery || selectedTag
              ? "Try adjusting your search or filter criteria"
              : "Start building your showcase by adding your first project"}
          </p>
          {!(searchQuery || selectedTag) && (
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          )}
        </div>
      )}

      {/* Project Grid */}
      {!isLoading && filteredAndSortedShowcases.length > 0 && (
        <div className={`mx-auto max-w-6xl grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1 sm:grid-cols-2"
        }`}>
          {filteredAndSortedShowcases.map((project) => (
            <Card
              key={project.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-0 shadow-md ${
                viewMode === "compact" ? "flex flex-row" : "flex flex-col"
              }`}
              onClick={() => openDetail(project.name)}
            >
              {/* Project Image */}
              <div className={`relative overflow-hidden ${
                viewMode === "compact" ? "w-32 flex-shrink-0" : "w-full"
              }`}>
                <img
                  src={project.image ?? SocialPreview}
                  alt={project.name}
                  className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                    viewMode === "compact" ? "w-32 h-full" : "w-full h-48"
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-start justify-between gap-2 group">
                    <span className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                      {project.name}
                    </span>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex flex-col gap-4 grow p-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(project);
                      }}
                      className="h-8"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScroll && (
        <Button
          variant="secondary"
          className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}

      {/* Enhanced Project Form Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {formMode === "create" ? "Add New Project" : "Edit Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Form Preview */}
            {(form.name || form.image) && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Preview</h4>
                <div className="flex gap-4">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SocialPreview;
                      }}
                    />
                  )}
                  <div>
                    <h5 className="font-medium">{form.name || "Project Name"}</h5>
                    {form.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Project Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="transition-all focus:ring-2"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="url" className="text-sm font-medium">
                  Project URL *
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={form.url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, url: e.target.value }))
                  }
                  className="transition-all focus:ring-2"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Input
                id="description"
                placeholder="Describe your project in a few words"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="transition-all focus:ring-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Image URL
              </Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                className="transition-all focus:ring-2"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add a screenshot or logo for your project
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="React, TypeScript, Tailwind (comma-separated)"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                className="transition-all focus:ring-2"
              />
              <p className="text-xs text-muted-foreground">
                Add relevant technologies or categories
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !form.name || !form.description || !form.url}
                className="min-w-24"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  formMode === "create" ? "Create Project" : "Update Project"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

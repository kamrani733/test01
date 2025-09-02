"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { ImageTs } from "@/core/types/imageTs";
import { MenuItem } from "@/core/types/menu";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  GripVertical,
  Plus,
  Save,
  Trash2,
  X
} from "lucide-react";
import { useState } from "react";
import LinkSelector from "./LinkSelector";
import FileUploadInput from "./input/FileUploadInput";

  interface DragDropMenuBuilderProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  onAutoSave?: (items: MenuItem[]) => void;
  menuId?: number;
  menuTitle?: string;
  isAutoSaving?: boolean;
}

interface MenuItemComponentProps {
  item: MenuItem;
  index: number;
  onUpdate: (index: number, item: MenuItem) => void;
  onRemove: (index: number) => void;
  onAddChild: (parentIndex: number) => void;
  level?: number;
}

function findParentAndIndex(
  id: number,
  items: MenuItem[],
  parent: MenuItem | null = null
): { parent: MenuItem | null; index: number } | null {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return { parent, index: i };
    }
    const children = items[i].children;
    if (children && children.length > 0) {
      const found = findParentAndIndex(id, children, items[i]);
      if (found) return found;
    }
  }
  return null;
}

function findItemById(id: number, items: MenuItem[]): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(id, item.children);
      if (found) return found;
    }
  }
  return null;
}

function updateSubtreeLevels(item: MenuItem, delta: number): void {
  if (delta === 0 || !item.children || item.children.length === 0) return;
  item.children.forEach((child) => {
    const newLevel = Math.max(0, Math.min(3, child.level + delta));
    child.level = newLevel;
    // Only recurse if the level actually changed
    if (newLevel !== child.level) {
      updateSubtreeLevels(child, delta);
    }
  });
}

function updatePriorities(container: MenuItem[]): void {
  container.forEach((item, i) => {
    item.priority = i + 1;
  });
}

function MenuItemComponent({ 
  item, 
  index, 
  onUpdate, 
  onRemove, 
  onAddChild, 
  level = 0 
}: MenuItemComponentProps) {
  const { dictionary } = useDictionary();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editData, setEditData] = useState(item);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(index, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(item);
    setIsEditing(false);
  };

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div style={style} ref={setNodeRef} className="mb-2">
      <Card className={`${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''} ${
        level === 1 ? 'bg-blue-50 border-blue-200' : 
        level === 2 ? 'bg-green-50 border-green-200' : 
        level === 3 ? 'bg-yellow-50 border-yellow-200' : 
        level >= 4 ? 'bg-purple-50 border-purple-200' : ''
      }`}>
        <CardContent className={`p-4 ${level > 0 ? 'border-l-4 border-blue-400' : ''}`}>
          <div className="flex items-center gap-3">
         

            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing hover:bg-gray-100 p-1 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            {/* Expand/Collapse Button */}
            { (hasChildren || true) && ( // Always show to allow expansion for dropping
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                )}
              </Button>
            )}

            {/* Menu Item Content */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Title Tabs */}
                    <div className="md:col-span-2">
                      <Tabs defaultValue="fa" className="w-full">
                        <TabsList className="border border-muted bg-primary-0">
                          <TabsTrigger
                            value="fa"
                            className="data-[state=active]:bg-muted"
                          >
                            {dictionary.ui.language.fa}
                          </TabsTrigger>
                          <TabsTrigger
                            value="en"
                            className="data-[state=active]:bg-muted"
                          >
                            {dictionary.ui.language.en}
                          </TabsTrigger>
                          <TabsTrigger
                            value="ar"
                            className="data-[state=active]:bg-muted"
                          >
                            {dictionary.ui.language.ar}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="fa">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {dictionary.forms.title} {dictionary.ui.language.fa}
                            </Label>
                            <Input
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                              placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                              className="w-full"
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="en">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {dictionary.forms.title} {dictionary.ui.language.en}
                            </Label>
                            <Input
                              value={editData.title_en || ""}
                              onChange={(e) => setEditData({ ...editData, title_en: e.target.value })}
                              placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                              className="w-full"
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="ar">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {dictionary.forms.title} {dictionary.ui.language.ar}
                            </Label>
                            <Input
                              value={editData.title_ar || ""}
                              onChange={(e) => setEditData({ ...editData, title_ar: e.target.value })}
                              placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                              className="w-full"
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">
                        {dictionary.forms.link}
                      </Label>
                      <div className="mt-1">
                        <LinkSelector
                          value={editData.link}
                          onChange={(link) => setEditData({ ...editData, link })}
                          placeholder={dictionary.forms.linkPathPlaceholder}
                        />
                      </div>
                    </div>
              
                    <div>
                      <Label className="text-sm font-medium">
                        {dictionary.forms.priority}
                      </Label>
                      <Input
                        type="number"
                        value={editData.priority}
                        onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                        placeholder={dictionary.forms.priority}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        {dictionary.forms.level}
                      </Label>
                      <Select
                        value={editData.level.toString()}
                        onValueChange={(value) => setEditData({ ...editData, level: parseInt(value) })}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">
                        {dictionary.forms.image} {dictionary.forms.optional}
                      </Label>
                      <div className="mt-1 space-y-3">
                        {/* Show existing image if available */}
                        {editData.image_info?.url && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={editData.image_info.url} 
                                alt={editData.image_info.description || editData.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{editData.image_info.name || 'Current Image'}</p>
                              <p className="text-xs text-gray-500">Current menu item image</p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setEditData({
                                ...editData,
                                image: undefined,
                                image_info: null
                              })}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {/* Upload new image */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2">
                            {editData.image_info?.url 
                              ? dictionary.forms.uploadNewImage
                              : dictionary.forms.uploadImageOptional
                            }
                          </p>
                          <FileUploadInput
                            accept="image/*"
                            onUploadSuccess={(image: ImageTs | null) => {
                              if (image) {
                                setEditData({
                                  ...editData,
                                  image: image.id,
                                  image_info: {
                                    id: image.id,
                                    url: image.url,
                                    description: image.name || "Menu item image",
                                    name: image.name
                                  }
                                });
                              } else {
                                setEditData({
                                  ...editData,
                                  image: undefined,
                                  image_info: null
                                });
                              }
                            }}
                            defaultImageUrl={editData.image_info?.url || undefined}
                            defaultImageName={editData.image_info?.name || undefined}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      {dictionary.common.save}
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      {dictionary.common.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {item.image_info?.url ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                          <img 
                            src={item.image_info.url} 
                            alt={item.image_info.description || item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex-shrink-0 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                          <span className="text-xs text-gray-400"></span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {item.title || dictionary.forms.linkSelector.dragDropMenuBuilder.untitled}
                          {level > 0 && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              {dictionary.forms.linkSelector.dragDropMenuBuilder.level} {level}
                            </span> 
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.link && `${dictionary.forms.linkSelector.dragDropMenuBuilder.link}: ${item.link}`}
                          {` • ${dictionary.forms.linkSelector.dragDropMenuBuilder.priority}: ${item.priority}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddChild(index)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      {isExpanded && (
        <div className={`mt-2 ${level > 0 ? 'ml-6' : ''}`}>
          {/* Hierarchy Connector Line */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          </div>
          {hasChildren ? (
            <SortableContext
              items={item.children!.map((child) => child.id)}
              strategy={verticalListSortingStrategy}
            >
              {item.children!.map((child, childIndex) => (
                <div key={child.id} className="relative">
                  {/* Horizontal connector line */}
                  <div className="absolute left-4 top-4 w-4 h-0.5 bg-gray-300"></div>
                  <MenuItemComponent
                    item={child}
                    index={childIndex}
                    onUpdate={(childIndex, updatedChild) => {
                      const updatedItem = { ...item };
                      updatedItem.children![childIndex] = updatedChild;
                      onUpdate(index, updatedItem);
                    }}
                    onRemove={(childIndex) => {
                      const updatedItem = { ...item };
                      updatedItem.children!.splice(childIndex, 1);
                      onUpdate(index, updatedItem);
                    }}
                    onAddChild={(childIndex) => {
                      const newChild: MenuItem = {
                        id: Date.now() + Math.floor(Math.random() * 1000),
                        title: dictionary.forms.linkSelector.dragDropMenuBuilder.newSubMenu,
                        title_en: dictionary.forms.linkSelector.dragDropMenuBuilder.newSubMenu,
                        title_ar: dictionary.forms.linkSelector.dragDropMenuBuilder.newSubMenu,
                        link: "/",
                        level: Math.min(3, child.level + 1),
                        priority: (child.children?.length || 0) + 1,
                        parentId: child.id,
                        children: [],
                      };
                      const updatedChild = { ...child };
                      updatedChild.children = [...(updatedChild.children || []), newChild];
                      const updatedItem = { ...item };
                      updatedItem.children![childIndex] = updatedChild;
                      onUpdate(index, updatedItem);
                    }}
                    level={level + 1}
                  />
                </div>
              ))}
            </SortableContext>
          ) : (
            <DroppableZone itemId={item.id} level={level} />
          )}
        </div>
      )}
    </div>
  );
}

function DroppableZone({ itemId, level }: { itemId: number; level: number }) {
  const { dictionary } = useDictionary();
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${itemId}`,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`relative ml-${(level + 1) * 6} min-h-[50px] flex items-center justify-center border-2 border-dashed rounded-md transition-colors ${
        isOver 
          ? 'border-blue-400 bg-blue-50 text-blue-600' 
          : 'border-gray-300 bg-gray-50 text-gray-500'
      }`}
    >
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">
            {isOver ? dictionary.forms.linkSelector.dropToAddSubmenu : dictionary.forms.linkSelector.dropHereToAddSubmenu}
        </span>
      </div>
    </div>
  );
}

export default function DragDropMenuBuilder({ items, onChange, onAutoSave, menuId, menuTitle, isAutoSaving }: DragDropMenuBuilderProps) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  // Log menu items to check for images
  console.log("🔍 Menu Items Structure Check:", {
    totalItems: safeItems.length,
    itemsWithImages: safeItems.filter(item => item.image || item.image || item.imageUrl).length,
    itemsWithImageInfo: safeItems.filter(item => item.image).length,
    itemsWithImageId: safeItems.filter(item => item.image).length,
    itemsWithImageUrl: safeItems.filter(item => item.imageUrl).length,
    sampleItemWithImage: safeItems.find(item => item.image || item.image || item.imageUrl),
    allItems: safeItems.map(item => ({
      id: item.id,
      title: item.title,
      hasImageInfo: !!item.image,
      hasImageId: !!item.image,
      hasImageUrl: !!item.imageUrl,
      imageInfo: item.image,
      imageId: item.image,
      imageUrl: item.imageUrl
    }))
  });
  
  // Clean menu data before sending to API
  const cleanMenuData = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems.map(item => ({
      id: item.id,
      title: item.title || '',
      title_en: item.title_en || null,
      title_ar: item.title_ar || null,
      link: item.link || '/',
      level: Math.max(1, Math.min(3, item.level || 1)), // Start from level 1, not 0
      priority: Math.max(1, item.priority || 1),
      parentId: item.parentId || 0,
      children: item.children ? cleanMenuData(item.children) : [],
      image: item.image || undefined
    }));
  };
  const { dictionary } = useDictionary();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced for more responsive dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string | number;

    if (activeId === overId) return;

    try {
      // Find active info
      const activeInfo = findParentAndIndex(activeId, safeItems);
      if (!activeInfo) return;

      const activeParent = activeInfo.parent;
      const activeIndex = activeInfo.index;
      const activeContainer = activeParent ? activeParent.children! : safeItems;

      let overParent: MenuItem | null = null;
      let overIndex: number = 0;
      let overContainer: MenuItem[] = [];

      if (typeof overId === 'string' && overId.startsWith("drop-")) {
        const parentId = parseInt(overId.substring(5));
        const parentItem = findItemById(parentId, safeItems);
        if (!parentItem) return;

        overParent = parentItem;
        overContainer = parentItem.children!;
        overIndex = overContainer.length;
      } else {
        const overInfo = findParentAndIndex(overId as number, safeItems);
        if (!overInfo) return;

        overParent = overInfo.parent;
        overIndex = overInfo.index;
        overContainer = overParent ? overParent.children! : items;
      }

      // Create a deep copy to avoid mutations
      const newItems = JSON.parse(JSON.stringify(safeItems));
      
      // Find the moved item in the new structure
      const newActiveInfo = findParentAndIndex(activeId, newItems);
      if (!newActiveInfo) return;

      const newActiveParent = newActiveInfo.parent;
      const newActiveIndex = newActiveInfo.index;
      const newActiveContainer = newActiveParent ? newActiveParent.children! : newItems;

      // Move item
      const movedItem = newActiveContainer[newActiveIndex];
      newActiveContainer.splice(newActiveIndex, 1);

      // Find target container in new structure
      let newOverParent: MenuItem | null = null;
      let newOverContainer: MenuItem[] = [];

      if (typeof overId === 'string' && overId.startsWith("drop-")) {
        const parentId = parseInt(overId.substring(5));
        const parentItem = findItemById(parentId, newItems);
        if (!parentItem) return;

        newOverParent = parentItem;
        newOverContainer = parentItem.children!;
        newOverContainer.push(movedItem);
      } else {
        const newOverInfo = findParentAndIndex(overId as number, newItems);
        if (!newOverInfo) return;

        newOverParent = newOverInfo.parent;
        newOverContainer = newOverParent ? newOverParent.children! : newItems;
        newOverContainer.splice(overIndex, 0, movedItem);
      }

      // Update level and parentId
      const newLevel = newOverParent ? Math.min(3, newOverParent.level + 1) : 1;
      movedItem.level = newLevel;
      movedItem.parentId = newOverParent ? newOverParent.id : 0;

      // Update priorities
      updatePriorities(newActiveContainer);
      if (newActiveContainer !== newOverContainer) {
        updatePriorities(newOverContainer);
      }

      // Clean the data before passing it up
      const cleanedItems = cleanMenuData(newItems);
      onChange(cleanedItems);
      
      // Auto-save after drag and drop
      if (onAutoSave) {
        onAutoSave(cleanedItems);
      }
    } catch (error) {
      console.error('Error in handleDragEnd:', error);
      // If there's an error, just return without updating
      return;
    }
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: dictionary.forms.linkSelector.dragDropMenuBuilder.newMenu,
      title_en: dictionary.forms.linkSelector.dragDropMenuBuilder.newMenu,
      title_ar: dictionary.forms.linkSelector.dragDropMenuBuilder.newMenu,
      link: "/",
      level: 1, // Start with level 1 instead of 0
      priority: safeItems.length + 1,
      parentId: 0,
      children: [],
    };
    
    const newItems = [...safeItems, newItem];
    const cleanedItems = cleanMenuData(newItems);
    onChange(cleanedItems);
    
    // Auto-save after adding item
    if (onAutoSave) {
      onAutoSave(cleanedItems);
    }
  };

  const updateMenuItem = (index: number, updatedItem: MenuItem) => {
    const newItems = [...safeItems];
    newItems[index] = updatedItem;
    const cleanedItems = cleanMenuData(newItems);
    onChange(cleanedItems);
    
    // Auto-save after updating item
    if (onAutoSave) {
      onAutoSave(cleanedItems);
    }
  };

  const removeMenuItem = (index: number) => {
    const newItems = safeItems.filter((_, i) => i !== index);
    const cleanedItems = cleanMenuData(newItems);
    onChange(cleanedItems);
    
    // Auto-save after removing item
    if (onAutoSave) {
      onAutoSave(cleanedItems);
    }
  };

  const addChildItem = (parentIndex: number) => {
    const parent = safeItems[parentIndex];
    const newChild: MenuItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: dictionary.forms.linkSelector.dragDropMenuBuilder.newSubMenu,
      title_en: dictionary.forms.linkSelector.dragDropMenuBuilder.newSubMenu,
      title_ar: dictionary.forms.linkSelector.dragDropMenuBuilder.newSubMenu,
      link: "/",
      level: Math.min(3, parent.level + 1),
      priority: (parent.children?.length || 0) + 1,
      parentId: parent.id,
      children: [],
    };
    
    const newItems = [...safeItems];
    const updatedParent = { ...parent };
    updatedParent.children = [...(updatedParent.children || []), newChild];
    newItems[parentIndex] = updatedParent;
    
    const cleanedItems = cleanMenuData(newItems);
    onChange(cleanedItems);
    
    // Auto-save after adding child item
    if (onAutoSave) {
      onAutoSave(cleanedItems);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">{dictionary.forms.linkSelector.dragDropMenuBuilder.menuItems}</h3>
          {onAutoSave && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-yellow-500 animate-spin' : 'bg-green-500 animate-pulse'}`}></div>
              <span>{isAutoSaving ? dictionary.forms.autoSaving : dictionary.forms.autoSaveEnabled}</span>
            </div>
          )}
        </div>
        <Button 
          type="button"
          onClick={addMenuItem}
          variant="outline" 
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {dictionary.forms.linkSelector.dragDropMenuBuilder.addMenuItem}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{dictionary.forms.linkSelector.dragDropMenuBuilder.noMenuItems}</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                index={index}
                onUpdate={updateMenuItem}
                onRemove={removeMenuItem}
                onAddChild={addChildItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

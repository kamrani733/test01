"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { getPages } from "@/core/lib/api/account/pages";
import { getShopCategories } from "@/core/lib/api/account/shop-categories";
import { getShopProducts } from "@/core/lib/api/account/shop-products";
import { getShopTags } from "@/core/lib/api/account/shop-tags";
import { ExternalLink, FileText, FolderOpen, Link as LinkIcon, Package, RefreshCw, Search, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";

interface LinkSelectorProps {
  value: string;
  onChange: (link: string) => void;
  placeholder?: string;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  url: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  url: string;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  url: string;
}

interface Category {
  id: number;
  title: string;
  slug: string;
  url: string;
}

export default function LinkSelector({ value, onChange, placeholder = "Enter link or select from below" }: LinkSelectorProps) {
  const { dictionary } = useDictionary();
  const [isOpen, setIsOpen] = useState(false);
  const [manualLink, setManualLink] = useState(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [productsPage, setProductsPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [tagsPage, setTagsPage] = useState(1);
  const [pagesPage, setPagesPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [hasMoreTags, setHasMoreTags] = useState(true);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

  // Helper function to fetch pages with pagination
  const fetchPages = async (page: number = 1, append: boolean = false) => {
    try {
      const response = await getPages({
        page,
        perPage: 20, // Load 20 items per page
        filters: [],
        sort: [],
        globalFilter: debouncedSearchQuery || null
      });
      
      if (response?.status === 'success' && response.data?.data) {
        const pagesData = response.data.data
          .filter((page: any) => page && page.id && page.title) // Filter out invalid pages
          .map((page: any) => ({
            id: page.id,
            title: page.title || 'Untitled',
            slug: page.slug || '',
            url: `/page/${page.slug || ''}`
          }));
        
        if (append) {
          setPages(prev => [...prev, ...pagesData]);
        } else {
          setPages(pagesData);
        }
        
        // Check if there are more pages
        const totalPages = response.data.last_page || 1;
        setHasMorePages(page < totalPages);
      } else {
        if (!append) {
          setPages([]);
        }
        setHasMorePages(false);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      if (!append) {
        setPages([]);
      }
      setHasMorePages(false);
    }
  };

  // Helper function to fetch tags with pagination
  const fetchTags = async (page: number = 1, append: boolean = false) => {
    try {
      const response = await getShopTags({
        page,
        perPage: 20, // Load 20 items per page
        filters: [],
        sort: [],
        globalFilter: debouncedSearchQuery || null
      });
      
      if (response?.status === 'success' && response.data?.data) {
        const tagsData = response.data.data
          .filter((tag: any) => tag && tag.id && tag.name) // Filter out invalid tags
          .map((tag: any) => ({
            id: tag.id,
            name: tag.name || 'Untitled',
            slug: tag.slug || '',
            url: `/tag/${tag.slug || ''}`
          }));
        
        if (append) {
          setTags(prev => [...prev, ...tagsData]);
        } else {
          setTags(tagsData);
        }
        
        // Check if there are more pages
        const totalPages = response.data.last_page || 1;
        setHasMoreTags(page < totalPages);
      } else {
        if (!append) {
          setTags([]);
        }
        setHasMoreTags(false);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      if (!append) {
        setTags([]);
      }
      setHasMoreTags(false);
    }
  };

  // Helper function to fetch products with pagination
  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      const response = await getShopProducts({
        page,
        perPage: 20,
        filters: [],
        sort: [],
        globalFilter: debouncedSearchQuery || null
      });
     
      
      if (response?.status === 'success' && response.data?.data) {
        const productsData = response.data.data
          .filter((product: any) => product && (product.value || product.id) && (product.label || product.title || product.name))
          .map((product: any) => ({
            id: product.value || product.id,
            title: product.label || product.title || product.name || 'Untitled',
            slug: product.slug || '',
            url: `/shop/product/${product.value || product.id}/${product.slug || ''}`
          }));
        
        
        if (append) {
          setProducts(prev => [...prev, ...productsData]);
        } else {
          setProducts(productsData);
        }
        
        const totalPages = response.data.last_page || 1;
        setHasMoreProducts(page < totalPages);
      } else {
        
        // Try alternative response structure
        if (response?.data && Array.isArray(response.data)) {
          const productsData = response.data
            .filter((product: any) => product && (product.value || product.id) && (product.label || product.title || product.name))
            .map((product: any) => ({
              id: product.value || product.id,
              title: product.label || product.title || product.name || 'Untitled',
              slug: product.slug || '',
              url: `/shop/product/${product.value || product.id}/${product.slug || ''}`
            }));
          
          if (append) {
            setProducts(prev => [...prev, ...productsData]);
          } else {
            setProducts(productsData);
          }
          setHasMoreProducts(false); // Assume no more pages for this structure
        } else {
          if (!append) {
            setProducts([]);
          }
          setHasMoreProducts(false);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (!append) {
        setProducts([]);
      }
      setHasMoreProducts(false);
    }
  };

  // Helper function to fetch categories with pagination
  const fetchCategories = async (page: number = 1, append: boolean = false) => {
    try {
      const response = await getShopCategories({
        page,
        perPage: 20, // Load 20 items per page
        filters: [],
        sort: [],
        globalFilter: debouncedSearchQuery || null
      });
      
      if (response?.status === 'success' && response.data?.data) {
        const categoriesData = response.data.data
          .filter((category: any) => category && (category.value || category.id) && (category.label || category.title || category.name))
          .map((category: any) => ({
            id: category.value || category.id,
            title: category.label || category.title || category.name || 'Untitled',
            slug: category.slug || '',
            url: `/category/${category.slug || ''}`
          }));
        
        if (append) {
          setCategories(prev => [...prev, ...categoriesData]);
        } else {
          setCategories(categoriesData);
        }
        
        // Check if there are more pages
        const totalPages = response.data.last_page || 1;
        setHasMoreCategories(page < totalPages);
      } else {
        
        // Try alternative response structure
        if (response?.data && Array.isArray(response.data)) {
          const categoriesData = response.data
            .filter((category: any) => category && (category.value || category.id) && (category.label || category.title || category.name))
            .map((category: any) => ({
              id: category.value || category.id,
              title: category.label || category.title || category.name || 'Untitled',
              slug: category.slug || '',
              url: `/category/${category.slug || ''}`
            }));
          
          if (append) {
            setCategories(prev => [...prev, ...categoriesData]);
          } else {
            setCategories(categoriesData);
          }
          setHasMoreCategories(false); // Assume no more pages for this structure
        } else {
          if (!append) {
            setCategories([]);
          }
          setHasMoreCategories(false);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (!append) {
        setCategories([]);
      }
      setHasMoreCategories(false);
    }
  };

  useEffect(() => {
    setManualLink(value);
  }, [value]);

  useEffect(() => {
    // Fetch data when component mounts
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPages(1, false),
          fetchTags(1, false),
          fetchProducts(1, false),
          fetchCategories(1, false)
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when debounced search query changes
  useEffect(() => {
    // Reset to first page and clear existing data when searching
    setProductsPage(1);
    setCategoriesPage(1);
    setTagsPage(1);
    setPagesPage(1);
    setProducts([]);
    setCategories([]);
    setTags([]);
    setPages([]);
    
    // Fetch new data with search query
    const searchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPages(1, false),
          fetchTags(1, false),
          fetchProducts(1, false),
          fetchCategories(1, false)
        ]);
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchData();
  }, [debouncedSearchQuery]);

  const handleManualSubmit = () => {
    onChange(manualLink);
    setIsOpen(false);
  };

  const handleSelectPage = (page: Page) => {
    onChange(page.url);
    setIsOpen(false);
  };

  const handleSelectTag = (tag: Tag) => {
    onChange(tag.url);
    setIsOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    onChange(product.url);
    setIsOpen(false);
  };

  const handleSelectCategory = (category: Category) => {
    onChange(category.url);
    setIsOpen(false);
  };

  // Handle tab change and clear search
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  // Load more functions
  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMoreProducts) return;
    
    setIsLoadingMore(true);
    const nextPage = productsPage + 1;
    setProductsPage(nextPage);
    
    try {
      await fetchProducts(nextPage, true);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreCategories = async () => {
    if (isLoadingMore || !hasMoreCategories) return;
    
    setIsLoadingMore(true);
    const nextPage = categoriesPage + 1;
    setCategoriesPage(nextPage);
    
    try {
      await fetchCategories(nextPage, true);
    } catch (error) {
      console.error('Error loading more categories:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreTags = async () => {
    if (isLoadingMore || !hasMoreTags) return;
    
    setIsLoadingMore(true);
    const nextPage = tagsPage + 1;
    setTagsPage(nextPage);
    
    try {
      await fetchTags(nextPage, true);
    } catch (error) {
      console.error('Error loading more tags:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMorePages = async () => {
    if (isLoadingMore || !hasMorePages) return;
    
    setIsLoadingMore(true);
    const nextPage = pagesPage + 1;
    setPagesPage(nextPage);
    
    try {
      await fetchPages(nextPage, true);
    } catch (error) {
      console.error('Error loading more pages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

 
  const isExternalLink = value && (value.startsWith('http://') || value.startsWith('https://'));

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-8"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isExternalLink && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{dictionary.forms.linkSelector.externalLink}</p> 
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dictionary.forms.linkSelector.selectLink}</DialogTitle>
            <DialogDescription>
              {dictionary.forms.linkSelector.selectLinkDescription}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="manual">{dictionary.forms.linkSelector.manual}</TabsTrigger>
              <TabsTrigger value="pages">{dictionary.forms.linkSelector.pages}</TabsTrigger>
              <TabsTrigger value="tags">{dictionary.forms.linkSelector.tags}</TabsTrigger>
              <TabsTrigger value="products">{dictionary.forms.linkSelector.products}</TabsTrigger>
              <TabsTrigger value="categories">{dictionary.forms.linkSelector.categories}</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-link">{dictionary.forms.linkSelector.enterLinkUrl}</Label>
                <Input
                  id="manual-link"
                  value={manualLink}
                  onChange={(e) => setManualLink(e.target.value)}
                  placeholder={dictionary.forms.linkSelector.linkPlaceholder}
                />
                <div className="flex gap-2">
                  <Button onClick={handleManualSubmit} className="flex-1">
                    {dictionary.forms.linkSelector.useThisLink}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setManualLink(value)}
                  >
                    {dictionary.common.reset}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{dictionary.forms.linkSelector.quickLinks}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualLink('/')}
                  >
                    {dictionary.forms.linkSelector.homePage}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualLink('/about')}
                  >
                    {dictionary.forms.linkSelector.aboutUs}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualLink('/contact')}
                  >
                    {dictionary.forms.linkSelector.contact}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualLink('/products')}
                  >
                    {dictionary.forms.linkSelector.products}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualLink('/blog')}
                  >
                    {dictionary.forms.linkSelector.blog}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualLink('/services')}
                  >
                    {dictionary.forms.linkSelector.services}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{dictionary.forms.linkSelector.searchPages}</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      setPagesPage(1);
                      setPages([]);
                      fetchPages(1, false).finally(() => setIsLoading(false));
                    }}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    {dictionary.forms.linkSelector.refresh}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dictionary.forms.linkSelector.searchPagesPlaceholder}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.loadingPages}
                  </div>
                ) : pages.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.noPagesFound}
                  </div>
                ) : (
                  <>
                    {pages.map((page) => (
                      <Card 
                        key={page.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSelectPage(page)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{page.title || 'Untitled'}</div>
                                <div className="text-sm text-gray-500">{page.url}</div>
                              </div>
                            </div>
                            <Badge variant="secondary">{page.slug || 'no-slug'}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {hasMorePages && (
                      <div className="text-center py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadMorePages}
                          disabled={isLoadingMore}
                          className="w-full"
                        >
                          {isLoadingMore ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            dictionary.forms.linkSelector.loadMorePages
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tags" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{dictionary.forms.linkSelector.searchTags}</Label> 
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      setTagsPage(1);
                      setTags([]);
                      fetchTags(1, false).finally(() => setIsLoading(false));
                    }}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    {dictionary.forms.linkSelector.refresh}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={dictionary.forms.linkSelector.searchTagsPlaceholder}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.loadingTags}
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.noTagsFound}
                  </div>
                ) : (
                  <>
                    {tags.map((tag) => (
                      <Card 
                        key={tag.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSelectTag(tag)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{tag.name || 'Untitled'}</div>
                                <div className="text-sm text-gray-500">{tag.url}</div>
                              </div>
                            </div>
                            <Badge variant="outline">{tag.slug || 'no-slug'}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {hasMoreTags && (
                      <div className="text-center py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadMoreTags}
                          disabled={isLoadingMore}
                          className="w-full"
                        >
                          {isLoadingMore ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            dictionary.forms.linkSelector.loadMoreTags
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{dictionary.forms.linkSelector.searchProducts}</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      setProductsPage(1);
                      setProducts([]);
                      fetchProducts(1, false).finally(() => setIsLoading(false));
                    }}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    {dictionary.forms.linkSelector.refresh}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dictionary.forms.linkSelector.searchProductsPlaceholder}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.loadingProducts}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.noProductsFound}
                  </div>
                ) : (
                  <>
                    {products.map((product) => (
                      <Card 
                        key={product.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{product.title || 'Untitled'}</div>
                                <div className="text-sm text-gray-500">{product.url}</div>
                              </div>
                            </div>
                            <Badge variant="secondary">{product.slug || 'no-slug'}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {hasMoreProducts && (
                      <div className="text-center py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadMoreProducts}
                          disabled={isLoadingMore}
                          className="w-full"
                        >
                          {isLoadingMore ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            dictionary.forms.linkSelector.loadMoreProducts
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{dictionary.forms.linkSelector.searchCategories}</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      setCategoriesPage(1);
                      setCategories([]);
                      fetchCategories(1, false).finally(() => setIsLoading(false));
                    }}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    {dictionary.forms.linkSelector.refresh}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dictionary.forms.linkSelector.searchCategoriesPlaceholder}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.loadingCategories}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {dictionary.forms.linkSelector.noCategoriesFound}
                  </div>
                ) : (
                  <>
                    {categories.map((category) => (
                      <Card 
                        key={category.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSelectCategory(category)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{category.title || 'Untitled'}</div>
                                <div className="text-sm text-gray-500">{category.url}</div>
                              </div>
                            </div>
                            <Badge variant="outline">{category.slug || 'no-slug'}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {hasMoreCategories && (
                      <div className="text-center py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadMoreCategories}
                          disabled={isLoadingMore}
                          className="w-full"
                        >
                          {isLoadingMore ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            dictionary.forms.linkSelector.loadMoreCategories  
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

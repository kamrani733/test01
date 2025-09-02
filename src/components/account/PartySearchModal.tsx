"use client";

import { useState, useEffect } from "react";
import { Search, User, Building2, Phone, Mail, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { Party, Company, Person } from "@/core/models/party-model";
import { searchParties } from "@/core/lib/api/account/parties";

interface PartySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectParty: (party: Party) => void;
  searchFields?: {
    mobile?: string;
    email?: string;
    code?: string;
    national_code?: string;
    first_name?: string;
    last_name?: string;
    national_id?: string;
    trade_name?: string;
  };
}

interface SearchResult {
  party: Party;
  matchReason: string;
  matchField: string;
}

export default function PartySearchModal({
  isOpen,
  onClose,
  onSelectParty,
  searchFields = {},
}: PartySearchModalProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchForParties = async () => {
    setIsSearching(true);
    setSearchError("");
    setHasSearched(true);

    try {
      const data = await searchParties(searchFields);
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("خطا در جستجوی طرف‌ها");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isOpen && Object.keys(searchFields).length > 0) {
      searchForParties();
    }
  }, [isOpen, searchFields]);

  const getDisplayName = (party: Party) => {
    if (party.entity === "company") {
      const company = party as Company;
      return company.trade_name || company.legal_name || "نامشخص";
    } else {
      const person = party as Person;
      return `${person.first_name} ${person.last_name}`;
    }
  };

  const getMatchIcon = (field: string) => {
    switch (field) {
      case "mobile":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "code":
        return <Hash className="h-4 w-4" />;
      case "national_code":
      case "national_id":
        return <Hash className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getMatchReason = (field: string, value: string) => {
    const fieldNames: Record<string, string> = {
      mobile: "شماره موبایل",
      email: "ایمیل",
      code: "کد طرف",
      national_code: "کد ملی",
      national_id: "شناسه ملی",
      first_name: "نام",
      last_name: "نام خانوادگی",
      trade_name: "نام تجاری",
    };

    return `تطابق در ${fieldNames[field] || field}: ${value}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-primary-bold text-primary-900">
            جستجوی طرف‌های موجود
          </DialogTitle>
          <DialogDescription>
            بررسی وجود طرف‌های مشابه در سیستم برای جلوگیری از ثبت تکراری
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Fields Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">فیلدهای جستجو:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(searchFields).map(([key, value]) => (
                value && (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {value}
                  </Badge>
                )
              ))}
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={searchForParties}
            disabled={isSearching || Object.keys(searchFields).length === 0}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                در حال جستجو...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                جستجوی طرف‌های موجود
              </>
            )}
          </Button>

          {/* Error Display */}
          {searchError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}

          {/* Search Results */}
          {hasSearched && !isSearching && (
            <div className="space-y-3">
              <h4 className="font-medium">
                نتایج جستجو ({searchResults.length} مورد)
              </h4>
              
              {searchResults.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    هیچ طرف مشابهی یافت نشد. می‌توانید طرف جدید ایجاد کنید.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {result.party.entity === "company" ? (
                            <Building2 className="h-5 w-5 text-blue-600 mt-1" />
                          ) : (
                            <User className="h-5 w-5 text-green-600 mt-1" />
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">
                                {getDisplayName(result.party)}
                              </h5>
                              <Badge variant={result.party.status === "active" ? "verified" : "destructive"}>
                                {result.party.status === "active" ? "فعال" : "غیرفعال"}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {result.party.mobile}
                              </div>
                              {result.party.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3" />
                                  {result.party.email}
                                </div>
                              )}
                              {result.party.code && (
                                <div className="flex items-center gap-2">
                                  <Hash className="h-3 w-3" />
                                  {result.party.code}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              {getMatchIcon(result.matchField)}
                              {getMatchReason(result.matchField, result.matchReason)}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onSelectParty(result.party);
                            onClose();
                          }}
                        >
                          انتخاب
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

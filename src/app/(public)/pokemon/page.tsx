"use client";

import Button from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Textarea } from "@/components/shadcn/textarea";
import { Progress } from "@radix-ui/react-progress";
import { Badge, Copy, Loader2, Play, StopCircle, Table, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

// Row Data Structure
type LinkRow = {
  id: number;
  originalUrl: string;
  finalUrl?: string;
  status: "idle" | "loading" | "success" | "error";
  statusCode?: string | number;
  reason?: string;
  isBroken?: boolean;
};

export default function BulkCheckerPage() {
  const [inputText, setInputText] = useState("");
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const stopSignalRef = useRef(false);

  // Derived Stats
  const brokenLinks = links.filter((l) => l.isBroken);
  const checkedCount = links.filter((l) => l.status === "success" || l.status === "error").length;
  const progressPercent = links.length > 0 ? (checkedCount / links.length) * 100 : 0;

  // 1. PARSE INPUT & SHOW TABLE
  const handleLoadLinks = () => {
    let parsed: string[] = [];
    try {
      // Clean input: remove extra quotes or brackets if user pastes weirdly
      const cleanText = inputText.trim();

      // Attempt JSON parse
      if (cleanText.startsWith("[") && cleanText.endsWith("]")) {
        parsed = JSON.parse(cleanText);
      } else {
        throw new Error("Not JSON");
      }
    } catch {
      // Fallback: Split by newline or comma
      parsed = inputText
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s);
    }

    if (parsed.length === 0) {
      alert("No valid links found. Please paste a list.");
      return;
    }

    // Create Table Rows
    const newRows: LinkRow[] = parsed.map((url, index) => ({
      id: index,
      originalUrl: url,
      status: "idle",
      isBroken: false,
    }));

    setLinks(newRows);
    // Note: We do NOT clear inputText so user can edit if needed
  };

  // 2. PROCESSING LOOP
  const handleStart = async () => {
    if (links.length === 0) return;
    setIsProcessing(true);
    stopSignalRef.current = false;

    for (let i = 0; i < links.length; i++) {
      if (stopSignalRef.current) break;
      if (links[i].status !== "idle") continue; // Skip already checked

      // A. Update Row to Loading
      setLinks((prev) => prev.map((row) => (row.id === i ? { ...row, status: "loading" } : row)));

      try {
        const res = await fetch("/api/check", {
          method: "POST",
          body: JSON.stringify({ url: links[i].originalUrl }),
        });
        const result = await res.json();

        // B. Update Row with Result
        setLinks((prev) =>
          prev.map((row) =>
            row.id === i
              ? {
                  ...row,
                  status: result.isBroken ? "error" : "success",
                  finalUrl: result.finalUrl,
                  statusCode: result.status,
                  reason: result.reason,
                  isBroken: result.isBroken,
                }
              : row
          )
        );
      } catch (error) {
        setLinks((prev) => prev.map((row) => (row.id === i ? { ...row, status: "error", reason: "Network Error", isBroken: true } : row)));
      }

      // Throttle slightly to prevent UI freezing
      await new Promise((r) => setTimeout(r, 10));
    }
    setIsProcessing(false);
  };

  const handleStop = () => {
    stopSignalRef.current = true;
    setIsProcessing(false);
  };

  const handleReset = () => {
    setLinks([]);
    setInputText("");
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Bulk Link Validator</h1>
        <p className="text-muted-foreground">Step 1: Paste Links &rarr; Step 2: Load Table &rarr; Step 3: Start Checking</p>
      </div>

      {/* --- INPUT SECTION --- */}
      <Card className="border-2 border-muted/40">
        <CardHeader>
          <CardTitle>1. Input Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder='["https://example.com/1", "https://example.com/2"]'
            className="font-mono text-xs min-h-[120px]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={links.length > 0 && isProcessing}
          />
          <div className="flex gap-4">
            <Button onClick={handleLoadLinks} disabled={links.length > 0 || !inputText}>
              Load Table
            </Button>
            <Button variant="outline" onClick={handleReset} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- CONTROLS & PROGRESS --- */}
      {links.length > 0 && (
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-6 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>
                  Checking... {checkedCount} / {links.length}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            <div className="flex gap-3">
              {!isProcessing ? (
                <Button onClick={handleStart} size="lg" className="w-40 bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" /> Start Check
                </Button>
              ) : (
                <Button onClick={handleStop} size="lg" variant="destructive" className="w-40">
                  <StopCircle className="w-4 h-4 mr-2" /> Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- MAIN TABLE --- */}
      {links.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Results Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-[600px] overflow-auto">
              <Table>
                <TableHeader className="bg-slate-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">#</TableHead>
                    <TableHead className="w-[30%]">Original URL</TableHead>
                    <TableHead className="w-[30%]">Redirected URL</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="text-right">Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-xs text-muted-foreground">{row.id + 1}</TableCell>

                      {/* Original */}
                      <TableCell className="font-mono text-xs text-slate-600">
                        <div className="truncate max-w-[250px]" title={row.originalUrl}>
                          {row.originalUrl}
                        </div>
                      </TableCell>

                      {/* Final */}
                      <TableCell className="font-mono text-xs">
                        {row.status === "loading" ? (
                          <div className="flex items-center text-blue-600 animate-pulse">Checking...</div>
                        ) : (
                          <div className="truncate max-w-[250px]" title={row.finalUrl}>
                            {row.finalUrl || "-"}
                          </div>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {row.status === "idle" && <Badge>Waiting</Badge>}
                        {row.status === "loading" && (
                          <Badge className="bg-blue-500 hover:bg-blue-600">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Loading
                          </Badge>
                        )}
                        {row.status === "success" && <Badge className="bg-green-600 hover:bg-green-700">Valid</Badge>}
                        {row.status === "error" && <Badge>Broken</Badge>}
                      </TableCell>

                      {/* Info */}
                      <TableCell className="text-right text-xs font-medium text-red-600">{row.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- BROKEN LINKS ARRAY (SUMMARY) --- */}
      {brokenLinks.length > 0 && (
        <Card className="border-red-200 shadow-md">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-red-700 flex justify-between items-center">
              <span>3. Broken Links Array ({brokenLinks.length})</span>
              <Button
                size="sm"
                variant="outline"
                className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(brokenLinks.map((l) => l.originalUrl)))}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy Array
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">Copy this JSON array of broken links:</p>
            <Textarea
              className="font-mono text-xs min-h-[150px] bg-slate-50 text-red-800"
              readOnly
              value={JSON.stringify(
                brokenLinks.map((l) => l.originalUrl),
                null,
                2
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

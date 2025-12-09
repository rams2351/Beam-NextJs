"use client";

import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
// 1. FIX: Import Table from your UI components, NOT Lucide
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Textarea } from "@/components/shadcn/textarea";
import { Progress } from "@radix-ui/react-progress";
// 2. FIX: Removed 'Table' from icon imports
import { ArrowRight, CheckCircle2, Copy, Loader2, Play, Search, StopCircle, Trash2, XCircle } from "lucide-react";
import { useRef, useState } from "react";

// Data Structure
type LinkRow = {
  id: number;
  originalUrl: string;
  finalUrl?: string;
  status: "idle" | "loading" | "success" | "error";
  statusCode?: string | number;
  reason?: string;
  isBroken?: boolean;
};

export default function ExtractorPage() {
  // 1. INPUT STATES
  const [targetUrl, setTargetUrl] = useState("");
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(50);

  // 2. DATA STATES
  const [extractedLinks, setExtractedLinks] = useState<string[]>([]);
  const [tableRows, setTableRows] = useState<LinkRow[]>([]);
  const [totalLinks, setTotalLinks] = useState(0);

  // 3. UI STATES
  const [isScraping, setIsScraping] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const stopSignalRef = useRef(false);

  // Stats
  const brokenLinks = tableRows.filter((l) => l.isBroken);
  const checkedCount = tableRows.filter((l) => l.status === "success" || l.status === "error").length;
  const progressPercent = tableRows.length > 0 ? (checkedCount / tableRows.length) * 100 : 0;

  // ==============================
  // STEP 1: SCRAPE PAGE
  // ==============================
  const handleScrape = async () => {
    if (!targetUrl) return alert("Please enter a URL");

    setIsScraping(true);
    setExtractedLinks([]);
    setTableRows([]);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();

      if (data.success) {
        setExtractedLinks(data.links);
        setRangeStart(1);
        setRangeEnd(data.total);
        setTotalLinks(data.total);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to API");
    } finally {
      setIsScraping(false);
    }
  };

  // ==============================
  // STEP 2: PREPARE TABLE
  // ==============================
  const handleLoadTable = () => {
    const start = Math.max(0, rangeStart - 1);
    const end = Math.min(extractedLinks.length, rangeEnd);
    const subset = extractedLinks.slice(start, end);

    const newRows: LinkRow[] = subset.map((url, index) => ({
      id: index,
      originalUrl: url,
      status: "idle",
      isBroken: false,
    }));

    setTableRows(newRows);
  };

  // ==============================
  // STEP 3: CHECK LINKS
  // ==============================
  const handleStartCheck = async () => {
    if (tableRows.length === 0) return;

    setIsChecking(true);
    stopSignalRef.current = false;

    for (let i = 0; i < tableRows.length; i++) {
      if (stopSignalRef.current) break;
      if (tableRows[i].status !== "idle") continue;

      // A. Set Loading
      setTableRows((prev) => prev.map((row) => (row.id === i ? { ...row, status: "loading" } : row)));

      try {
        const res = await fetch("/api/check", {
          method: "POST",
          body: JSON.stringify({ url: tableRows[i].originalUrl }),
        });
        const result = await res.json();

        // C. Update Result
        setTableRows((prev) =>
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
        setTableRows((prev) => prev.map((row) => (row.id === i ? { ...row, status: "error", reason: "Network Err", isBroken: true } : row)));
      }

      await new Promise((r) => setTimeout(r, 20));
    }
    setIsChecking(false);
  };

  const handleStop = () => {
    stopSignalRef.current = true;
    setIsChecking(false);
  };

  const handleReset = () => {
    setExtractedLinks([]);
    setTableRows([]);
    setTargetUrl("");
  };

  return (
    <div className="container mx-auto py-10 max-w-7xl space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Web Link Auditor</h1>
          <p className="text-muted-foreground">Scrape a page, extract links, and validate redirects.</p>
        </div>
        {tableRows.length > 0 && (
          <div className="flex gap-4 text-sm font-medium">
            <span className="flex items-center text-green-600 gap-2">
              <CheckCircle2 size={16} /> {checkedCount - brokenLinks.length} Valid
            </span>
            <span className="flex items-center text-red-600 gap-2">
              <XCircle size={16} /> {brokenLinks.length} Broken
            </span>
          </div>
        )}
      </div>

      {/* STEP 1: SCRAPE */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5" /> Step 1: Scan Target Website
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <TextInput
            placeholder="https://coloringonly.com/..."
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            disabled={isScraping || isChecking}
            className="bg-white w-full"
          />
          <Button onClick={handleScrape} disabled={isScraping || isChecking} className="w-32">
            {isScraping ? <Loader2 className="animate-spin w-4 h-4" /> : "Scan Page"}
          </Button>
          {extractedLinks.length > 0 && (
            <Button variant="outline" onClick={handleReset} className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* STEP 2: FILTER & LOAD */}
      {extractedLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              <span>
                Step 2: Select Links to Check <span className="text-primary text-sm font-normal ml-2">(Total Links: {totalLinks})</span>
              </span>
              <div className="text-xs bg-slate-100 px-3 py-1 rounded-full">Links in memory: {extractedLinks.length}</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-6">
              <div className="grid w-full max-w-xs items-center gap-1.5">
                <label className="text-sm font-medium">Start Index</label>
                <TextInput type="number" value={rangeStart} onChange={(e) => setRangeStart(Number(e.target.value))} />
              </div>
              <div className="grid w-full max-w-xs items-center gap-1.5">
                <label className="text-sm font-medium">End Index</label>
                <TextInput type="number" value={rangeEnd} onChange={(e) => setRangeEnd(Number(e.target.value))} />
              </div>
              <Button onClick={handleLoadTable} disabled={isChecking} variant="secondary" className="w-40">
                Load into Table
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: RESULTS TABLE */}
      {tableRows.length > 0 && (
        <div className="space-y-4">
          {/* Progress Bar & Controls */}
          <Card className="border-blue-100 bg-blue-50/30">
            <CardContent className="pt-6 flex items-center gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>
                    Checking... {checkedCount} / {tableRows.length}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              <div>
                {!isChecking ? (
                  <Button onClick={handleStartCheck} className="bg-blue-600 hover:bg-blue-700 w-32">
                    <Play className="w-4 h-4 mr-2" /> Start
                  </Button>
                ) : (
                  <Button onClick={handleStop} variant="destructive" className="w-32">
                    <StopCircle className="w-4 h-4 mr-2" /> Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* The Table */}
          <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader className="bg-slate-100 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">#</TableHead>
                    <TableHead className="w-[30%]">Original Link</TableHead>
                    <TableHead className="w-[30%]">Redirected To</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="text-right">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>

                      {/* Original URL */}
                      <TableCell className="font-mono text-xs text-slate-600">
                        <div className=" max-w-[300px" title={row.originalUrl}>
                          {row.originalUrl}
                        </div>
                      </TableCell>

                      {/* Redirect Comparison */}
                      <TableCell className="font-mono text-xs">
                        {row.status === "loading" ? (
                          <span className="text-blue-500 animate-pulse flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" /> Checking...
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* Visual indicator if URL changed */}
                            {row.finalUrl && row.finalUrl !== row.originalUrl && <ArrowRight size={12} className="text-orange-500 shrink-0" />}
                            <div className="truncate max-w-[300px]" title={row.finalUrl || ""}>
                              {row.finalUrl || "-"}
                            </div>
                          </div>
                        )}
                      </TableCell>

                      {/* Status Badges */}
                      <TableCell>
                        {row.status === "idle" && <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-medium">Waiting</span>}
                        {row.status === "loading" && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Loading</span>}
                        {row.status === "success" && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Valid</span>}
                        {row.status === "error" && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Broken</span>}
                      </TableCell>

                      <TableCell className="text-right text-xs font-medium text-red-600">{row.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: BROKEN LINKS EXPORT */}
      {brokenLinks.length > 0 && (
        <Card className="border-red-200 shadow-md">
          <CardHeader className="bg-red-50 border-b border-red-100 flex flex-row items-center justify-between">
            <CardTitle className="text-red-800 text-lg">Broken Links Found ({brokenLinks.length})</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-red-700 border-red-200 hover:bg-red-50"
              onClick={() => {
                const text = brokenLinks.map((l) => l.originalUrl).join("\n");
                navigator.clipboard.writeText(text);
                alert("Copied broken links to clipboard");
              }}
            >
              <Copy className="w-4 h-4 mr-2" /> Copy List
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <Textarea
              readOnly
              value={JSON.stringify(
                brokenLinks.map((l) => l.originalUrl),
                null,
                2
              )}
              className="font-mono text-xs min-h-[150px] bg-slate-50 text-red-900"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

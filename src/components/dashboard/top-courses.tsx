"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  studentCount: number;
  rating: number;
  image?: string;
}

interface TopCoursesProps {
  courses?: Course[];
  isLoading?: boolean;
}

export function TopCourses({ courses, isLoading = false }: TopCoursesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Top Courses</CardTitle>
            <CardDescription>Most popular courses</CardDescription>
          </div>
          <Button variant="ghost" size="sm" disabled>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultCourses: Course[] = [
    { id: "1", title: "React Advanced", studentCount: 1250, rating: 4.8 },
    { id: "2", title: "Next.js Mastery", studentCount: 980, rating: 4.7 },
    { id: "3", title: "TypeScript Basics", studentCount: 875, rating: 4.6 },
    { id: "4", title: "Node.js Essentials", studentCount: 650, rating: 4.5 },
    { id: "5", title: "UI/UX Design", studentCount: 540, rating: 4.4 },
  ];

  const displayCourses = courses || defaultCourses;

  return (
    <Card className="bg-gray-100 dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Top Courses</CardTitle>
          <CardDescription>Most popular courses</CardDescription>
        </div>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayCourses.map((course, idx) => (
            <div key={course.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-semibold text-muted-foreground w-6">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.studentCount.toLocaleString()} Students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

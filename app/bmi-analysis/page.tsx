"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Scale, ArrowRight, CheckCircle, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthRequired } from "@/components/auth-required";
import { getUserProfile } from "@/lib/user-profile";

export default function BMIAnalysisPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [bmiValue, setBmiValue] = useState<string | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const { toast } = useToast();
  
  // Load user profile data when component mounts
  useEffect(() => {
    async function loadUserProfile() {
      setIsLoadingProfile(true);
      try {
        const profile = await getUserProfile();
        
        if (profile) {
          // Auto-fill form with user data if available
          if (profile.height) setHeight(profile.height.toString());
          if (profile.weight) setWeight(profile.weight.toString());
          if (profile.age) setAge(profile.age.toString());
          if (profile.gender) setGender(profile.gender);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    
    loadUserProfile();
  }, []);

  const calculateBMI = () => {
    let bmiValue: number;
    let heightInM: number;
    let weightInKg: number;

    if (unit === "metric") {
      heightInM = Number.parseFloat(height) / 100; // cm to m
      weightInKg = Number.parseFloat(weight);
    } else {
      // Imperial: height in inches, weight in pounds
      heightInM = Number.parseFloat(height) * 0.0254; // inches to m
      weightInKg = Number.parseFloat(weight) * 0.453592; // lbs to kg
    }

    bmiValue = weightInKg / (heightInM * heightInM);
    return bmiValue.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal weight";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  };

  const getAgeSpecificRecommendations = (
    bmiCategory: string,
    ageValue: number,
    genderValue: string
  ) => {
    const recommendations = [];

    // Base recommendations by BMI category
    if (bmiCategory === "Underweight") {
      recommendations.push(
        "Consider increasing your caloric intake with nutrient-dense foods."
      );
      recommendations.push("Focus on strength training to build muscle mass.");
      recommendations.push(
        "Consult with a healthcare provider to rule out underlying conditions."
      );
    } else if (bmiCategory === "Normal weight") {
      recommendations.push(
        "Maintain your healthy lifestyle with balanced nutrition and regular physical activity."
      );
      recommendations.push(
        "Focus on a variety of foods to ensure you get all necessary nutrients."
      );
      recommendations.push(
        "Regular exercise helps maintain muscle mass and cardiovascular health."
      );
    } else if (bmiCategory === "Overweight") {
      recommendations.push(
        "Focus on portion control and increasing physical activity."
      );
      recommendations.push(
        "Aim for 150 minutes of moderate exercise per week."
      );
      recommendations.push(
        "Reduce intake of processed foods and sugary beverages."
      );
    } else {
      recommendations.push(
        "Consider consulting with a healthcare provider for personalized advice."
      );
      recommendations.push(
        "Focus on gradual weight loss through diet modifications and increased physical activity."
      );
      recommendations.push(
        "Set realistic goals - aim for 1-2 pounds of weight loss per week."
      );
    }

    // Age-specific recommendations
    if (ageValue < 18) {
      recommendations.push(
        "As you're still growing, focus on balanced nutrition rather than weight loss."
      );
      recommendations.push(
        "Consult with a pediatrician before making significant dietary changes."
      );
    } else if (ageValue >= 18 && ageValue < 30) {
      recommendations.push(
        "Establish healthy habits now that will benefit you throughout life."
      );
      recommendations.push(
        "Focus on building muscle through resistance training."
      );
    } else if (ageValue >= 30 && ageValue < 50) {
      recommendations.push(
        "Maintain muscle mass with regular strength training."
      );
      recommendations.push(
        "Monitor stress levels as they can impact weight and overall health."
      );
    } else {
      recommendations.push(
        "Focus on maintaining muscle mass, which naturally decreases with age."
      );
      recommendations.push(
        "Include balance exercises to prevent falls and maintain mobility."
      );
      recommendations.push(
        "Ensure adequate calcium and vitamin D intake for bone health."
      );
    }

    // Gender-specific recommendations
    if (genderValue === "female") {
      recommendations.push(
        "Women need adequate iron, especially during menstruation."
      );
      if (ageValue > 40) {
        recommendations.push(
          "Consider bone density as women are at higher risk for osteoporosis after menopause."
        );
      }
    } else {
      recommendations.push(
        "Men typically need more calories due to higher muscle mass."
      );
      if (ageValue > 40) {
        recommendations.push(
          "Regular check-ups to monitor heart health are important for men."
        );
      }
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  };

  const handleAnalyze = () => {
    if (!height || !weight || !age) {
      toast({
        title: "Missing Information",
        description:
          "Please provide your height, weight, and age to calculate BMI.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate analysis delay
    setTimeout(() => {
      try {
        const bmi = calculateBMI();
        setBmiValue(bmi);

        const category = getBMICategory(Number.parseFloat(bmi));
        setBmiCategory(category);

        const ageValue = Number.parseInt(age, 10);
        const recs = getAgeSpecificRecommendations(category, ageValue, gender);
        setRecommendations(recs);

        setLoading(false);
      } catch (error) {
        console.error("Error calculating BMI:", error);
        toast({
          title: "Calculation Error",
          description:
            "There was an error calculating your BMI. Please check your inputs and try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
        BMI Analysis & Recommendations
      </h1>

      <AuthRequired title="BMI Analysis Requires Login" description="Please log in to calculate and track your BMI.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Calculate Your BMI</CardTitle>
                <CardDescription>
                  Enter your details to calculate your Body Mass Index (BMI)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={unit} onValueChange={setUnit} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height ({unit === "metric" ? "cm" : "inches"})
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={unit === "metric" ? "175" : "69"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight ({unit === "metric" ? "kg" : "lbs"})
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={unit === "metric" ? "70" : "154"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="border-primary/20 focus-visible:ring-primary shadow-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAnalyze}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-md hover:shadow-lg transition-all"
                disabled={!height || !weight || !age || loading || isLoadingProfile}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze My BMI <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-t-lg">
            <CardTitle>Your BMI Analysis</CardTitle>
            <CardDescription>
              Personalized insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] pt-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="mt-4 text-muted-foreground">
                    Analyzing your BMI...
                  </p>
                </div>
              </div>
            ) : bmiValue ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">
                          {bmiValue}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Your BMI
                        </div>
                      </div>
                    </div>
                    <div
                      className={`absolute top-0 right-0 h-12 w-12 rounded-full flex items-center justify-center ${
                        bmiCategory === "Normal weight"
                          ? "bg-green-500"
                          : bmiCategory === "Underweight"
                          ? "bg-blue-500"
                          : bmiCategory === "Overweight"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      <Info className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">
                    BMI Category: {bmiCategory}
                  </h3>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                      style={{
                        width: "100%",
                      }}
                    />
                    <div
                      className="h-4 w-4 bg-white border-2 border-primary rounded-full -mt-4 shadow-md"
                      style={{
                        marginLeft: `${Math.min(
                          Math.max(
                            ((Number.parseFloat(bmiValue) - 15) / 25) * 100,
                            0
                          ),
                          100
                        )}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">
                      Personalized Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <p className="mb-2">
                  Enter your height, weight, age, and gender, then click
                  "Analyze My BMI" to get personalized recommendations.
                </p>
                <p className="text-xs">
                  Your analysis will be tailored to your specific profile.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </AuthRequired>
    </div>
  );
}

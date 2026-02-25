import json
import os

def parse_questions(text):
    questions = []
    current_difficulty = "Easy"
    
    # Simple line-by-line or block-by-block parsing
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
            
        if "Part A: Easy" in line:
            current_difficulty = "Easy"
            i += 1
            continue
        if "Part B: Medium" in line:
            current_difficulty = "Medium"
            i += 1
            continue
        if "Part C: Hard" in line:
            current_difficulty = "Hard"
            i += 1
            continue
            
        # Match "1. [Category] Question"
        import re
        q_match = re.match(r'(\d+)\.\s*\[(.*?)\]\s*(.*)', line)
        if q_match:
            q_id = int(q_match.group(1))
            category = q_match.group(2)
            question_text = q_match.group(3)
            # print(f"Found Q: {q_id}")
            
            i += 1
            if i >= len(lines): break
            options_line = lines[i].strip()
            
            i += 1
            if i >= len(lines): break
            answer_line = lines[i].strip()
            
            # Parse options
            options = []
            if "|" in options_line:
                option_parts = re.split(r'\s*\|\s*', options_line)
                for part in option_parts:
                    opt_m = re.match(r'[A-D]\)\s*(.*)', part.strip())
                    if opt_m:
                        options.append(opt_m.group(1))
            
            # Parse answer
            ans_m = re.search(r'Answer:\s*([A-D])', answer_line)
            answer = ans_m.group(1) if ans_m else ""
            
            questions.append({
                "id": q_id,
                "category": category,
                "question": question_text,
                "options": options,
                "answer": answer,
                "difficulty": current_difficulty
            })
        i += 1
            
    return questions

if __name__ == "__main__":
    with open("questions_raw.txt", "r", encoding="utf-8") as f:
        text = f.read()
    
    parsed = parse_questions(text)
    
    output = "export const questions = " + json.dumps(parsed, indent=2) + ";"
    
    # Ensure src/data directory exists
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/questions.js", "w", encoding="utf-8") as f:
        f.write(output)
    
    print(f"Successfully parsed {len(parsed)} questions.")
